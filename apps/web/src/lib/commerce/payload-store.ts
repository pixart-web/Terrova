import type { CommerceEvent, CommerceEventStore, SubscriptionSyncTarget } from '@terrova/commerce'
import type { EntityID } from '@terrova/types'

import { cmsRequest, type PayloadList } from '../cms'
import { sendTransactionalEmail } from '../services/email'

type Document = Record<string, unknown> & { id: EntityID }

export type ProviderStateDecision = 'apply' | 'stale' | 'timestamp-only'

export function providerStateDecision(input: {
  lastProviderEventAt?: unknown
  currentStatus?: unknown
  providerEventAt: string
  incomingStatus: string
}): ProviderStateDecision {
  const incoming = Date.parse(input.providerEventAt)
  if (!Number.isFinite(incoming)) throw new Error('Provider event timestamp is invalid')
  const previous = input.lastProviderEventAt
    ? Date.parse(String(input.lastProviderEventAt))
    : Number.NEGATIVE_INFINITY
  if (Number.isFinite(previous) && incoming <= previous) return 'stale'
  if (String(input.currentStatus) === 'cancelled' && input.incomingStatus !== 'cancelled') {
    return 'timestamp-only'
  }
  return 'apply'
}

function relationID(value: unknown): EntityID | undefined {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id: EntityID }).id
  }
  return undefined
}

async function find(collection: string, field: string, value: EntityID) {
  const response = await cmsRequest<PayloadList<Document>>(
    `/api/${collection}?depth=2&limit=1&where[${field}][equals]=${encodeURIComponent(String(value))}`,
    { service: true, cache: 'no-store' },
  )
  return response.docs[0]
}

export class PayloadCommerceEventStore implements CommerceEventStore {
  async hasProcessed(providerEventId: string) {
    const event = await find('webhook-events', 'providerEventId', providerEventId)
    return Boolean(event && ['processed', 'ignored'].includes(String(event.status)))
  }

  async markProcessing(event: CommerceEvent) {
    const existing = await find('webhook-events', 'providerEventId', event.id)
    const body = {
      provider: 'stripe',
      providerEventId: event.id,
      eventType: event.type,
      livemode: event.livemode,
      status: 'processing',
      receivedAt: event.createdAt,
      attempts: Number(existing?.attempts ?? 0) + 1,
    }
    await cmsRequest(existing ? `/api/webhook-events/${existing.id}` : '/api/webhook-events', {
      service: true,
      method: existing ? 'PATCH' : 'POST',
      body: JSON.stringify(body),
    })
  }

  async markProcessed(providerEventId: string) {
    await this.updateStatus(providerEventId, 'processed')
  }

  async markFailed(providerEventId: string, message: string) {
    await this.updateStatus(providerEventId, 'failed', message)
  }

  async markIgnored(providerEventId: string) {
    await this.updateStatus(providerEventId, 'ignored')
  }

  private async updateStatus(providerEventId: string, status: string, message?: string) {
    const event = await find('webhook-events', 'providerEventId', providerEventId)
    if (!event) throw new Error('Webhook processing record is missing')
    await cmsRequest(`/api/webhook-events/${event.id}`, {
      service: true,
      method: 'PATCH',
      body: JSON.stringify({
        status,
        processedAt: new Date().toISOString(),
        errorCode: message ? message.slice(0, 120) : undefined,
      }),
    })
  }
}

export class PayloadSubscriptionSyncTarget implements SubscriptionSyncTarget {
  async syncSubscription(input: Parameters<SubscriptionSyncTarget['syncSubscription']>[0]) {
    const customer = input.customerId
      ? await cmsRequest<Document>(`/api/customers/${input.customerId}?depth=0`, {
          service: true,
          cache: 'no-store',
        })
      : await find('customers', 'externalCustomerId', input.providerCustomerId)
    const plan = input.providerPriceId
      ? await find('plans', 'externalPriceId', input.providerPriceId)
      : undefined
    if (!customer || !plan) throw new Error('Subscription cannot be mapped to customer and plan')
    const customerBrand = relationID(customer.brand)
    const planBrand = relationID(plan.brand)
    if (!customerBrand || String(customerBrand) !== String(planBrand)) {
      throw new Error('Subscription customer and plan brand do not match')
    }
    if (input.brandId && String(input.brandId) !== String(customerBrand)) {
      throw new Error('Subscription event brand does not match customer')
    }
    const existing = await find(
      'subscriptions',
      'providerSubscriptionId',
      input.providerSubscriptionId,
    )
    const decision = providerStateDecision({
      lastProviderEventAt: existing?.lastProviderEventAt,
      currentStatus: existing?.status,
      providerEventAt: input.providerEventAt,
      incomingStatus: input.status,
    })
    if (decision === 'stale') return
    if (decision === 'timestamp-only' && existing) {
      await cmsRequest(`/api/subscriptions/${existing.id}`, {
        service: true,
        method: 'PATCH',
        body: JSON.stringify({ lastProviderEventAt: input.providerEventAt }),
      })
      return
    }
    const body = {
      code: existing?.code ?? `SUB-${input.providerSubscriptionId}`,
      brand: customerBrand,
      customer: customer.id,
      plan: plan.id,
      status: input.status,
      currentPeriodStart: input.currentPeriodStart,
      currentPeriodEnd: input.currentPeriodEnd,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd,
      providerSubscriptionId: input.providerSubscriptionId,
      providerCustomerId: input.providerCustomerId,
      lastProviderEventAt: input.providerEventAt,
    }
    await cmsRequest(existing ? `/api/subscriptions/${existing.id}` : '/api/subscriptions', {
      service: true,
      method: existing ? 'PATCH' : 'POST',
      body: JSON.stringify(body),
    })
    if (!customer.externalCustomerId && input.providerCustomerId) {
      await cmsRequest(`/api/customers/${customer.id}`, {
        service: true,
        method: 'PATCH',
        body: JSON.stringify({ externalCustomerId: input.providerCustomerId }),
      })
    }
  }

  async recordInvoice(input: Parameters<SubscriptionSyncTarget['recordInvoice']>[0]) {
    if (!input.providerSubscriptionId) throw new Error('Invoice has no subscription reference')
    const subscription = await find(
      'subscriptions',
      'providerSubscriptionId',
      input.providerSubscriptionId,
    )
    if (!subscription) throw new Error('Invoice subscription has not been synchronized yet')
    const nextStatus = input.paid ? 'active' : 'payment_issue'
    const decision = providerStateDecision({
      lastProviderEventAt: subscription.lastProviderEventAt,
      currentStatus: subscription.status,
      providerEventAt: input.providerEventAt,
      incomingStatus: nextStatus,
    })
    if (decision !== 'stale') {
      await cmsRequest(`/api/subscriptions/${subscription.id}`, {
        service: true,
        method: 'PATCH',
        body: JSON.stringify({
          status: decision === 'apply' ? nextStatus : subscription.status,
          lastProviderEventAt: input.providerEventAt,
        }),
      })
    }

    if (input.paid && !(await find('orders', 'providerInvoiceId', input.providerInvoiceId))) {
      await cmsRequest('/api/orders', {
        service: true,
        method: 'POST',
        body: JSON.stringify({
          code: `ORD-${input.providerInvoiceId}`,
          brand: relationID(subscription.brand),
          customer: relationID(subscription.customer),
          subscription: subscription.id,
          status: 'paid',
          totalAmount: input.amountPaid,
          currency: input.currency,
          providerInvoiceId: input.providerInvoiceId,
          paidAt: new Date().toISOString(),
        }),
      })
    }

    if (!input.paid && decision === 'apply') {
      const customerID = relationID(subscription.customer)
      if (customerID) {
        const customer = await cmsRequest<Document>(`/api/customers/${customerID}`, {
          service: true,
          cache: 'no-store',
        })
        await sendTransactionalEmail({
          template: 'payment_problem',
          to: String(customer.email),
          brandName: 'Terrova',
          body: 'Your membership payment needs attention. Sign in to My Terrova to open secure billing management.',
        })
      }
    }
  }

  async attachCheckout(input: Parameters<SubscriptionSyncTarget['attachCheckout']>[0]) {
    if (!input.customerId || !input.providerCustomerId) {
      throw new Error('Checkout cannot be attached without customer references')
    }
    const customer = await cmsRequest<Document>(`/api/customers/${input.customerId}?depth=0`, {
      service: true,
      cache: 'no-store',
    })
    if (input.brandId && String(relationID(customer.brand)) !== String(input.brandId)) {
      throw new Error('Checkout customer and brand do not match')
    }
    await cmsRequest(`/api/customers/${input.customerId}`, {
      service: true,
      method: 'PATCH',
      body: JSON.stringify({ externalCustomerId: input.providerCustomerId }),
    })
  }
}
