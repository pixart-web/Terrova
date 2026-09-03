import type { CommerceEvent, SubscriptionSyncTarget } from './index'
import { mapProviderSubscriptionStatus } from './index'

function string(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined
}

function reference(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value)
    return string((value as { id: unknown }).id)
  return undefined
}

function timestamp(value: unknown): string | undefined {
  return typeof value === 'number' ? new Date(value * 1000).toISOString() : undefined
}

function metadata(data: Record<string, unknown>) {
  return data.metadata && typeof data.metadata === 'object'
    ? (data.metadata as Record<string, unknown>)
    : {}
}

function subscriptionPrice(data: Record<string, unknown>): string | undefined {
  const items =
    data.items && typeof data.items === 'object' ? (data.items as Record<string, unknown>) : {}
  const rows = Array.isArray(items.data) ? items.data : []
  const first = rows[0] && typeof rows[0] === 'object' ? (rows[0] as Record<string, unknown>) : {}
  const price =
    first.price && typeof first.price === 'object' ? (first.price as Record<string, unknown>) : {}
  return string(price.id)
}

export async function processCommerceEvent(
  event: CommerceEvent,
  target: SubscriptionSyncTarget,
): Promise<'processed' | 'ignored'> {
  const data = event.data

  if (event.type === 'checkout.session.completed') {
    const meta = metadata(data)
    await target.attachCheckout({
      providerCheckoutId: string(data.id) ?? event.id,
      providerCustomerId: reference(data.customer),
      providerSubscriptionId: reference(data.subscription),
      customerId: string(meta.customerId),
      brandId: string(meta.brandId),
    })
    return 'processed'
  }

  if (event.type.startsWith('customer.subscription.')) {
    const meta = metadata(data)
    const rows =
      data.items &&
      typeof data.items === 'object' &&
      Array.isArray((data.items as { data?: unknown }).data)
        ? ((data.items as { data: Array<Record<string, unknown>> }).data ?? [])
        : []
    const firstItem = rows[0]
    await target.syncSubscription({
      providerSubscriptionId: string(data.id) ?? event.id,
      providerCustomerId: reference(data.customer) ?? '',
      providerPriceId: subscriptionPrice(data),
      status:
        event.type === 'customer.subscription.deleted'
          ? 'cancelled'
          : mapProviderSubscriptionStatus(string(data.status) ?? 'pending'),
      currentPeriodStart: timestamp(firstItem?.current_period_start ?? data.current_period_start),
      currentPeriodEnd: timestamp(firstItem?.current_period_end ?? data.current_period_end),
      cancelAtPeriodEnd: Boolean(data.cancel_at_period_end),
      customerId: string(meta.customerId),
      brandId: string(meta.brandId),
      providerEventAt: event.createdAt,
      providerEventId: event.id,
    })
    return 'processed'
  }

  if (event.type === 'invoice.paid' || event.type === 'invoice.payment_failed') {
    const parent =
      data.parent && typeof data.parent === 'object' ? (data.parent as Record<string, unknown>) : {}
    const subscriptionDetails =
      parent.subscription_details && typeof parent.subscription_details === 'object'
        ? (parent.subscription_details as Record<string, unknown>)
        : {}
    await target.recordInvoice({
      providerInvoiceId: string(data.id) ?? event.id,
      providerSubscriptionId: reference(subscriptionDetails.subscription ?? data.subscription),
      amountPaid: Number(data.amount_paid ?? 0),
      currency: (string(data.currency)?.toUpperCase() ?? 'EUR') as 'EUR' | 'GBP' | 'USD',
      paid: event.type === 'invoice.paid',
      providerEventAt: event.createdAt,
      providerEventId: event.id,
    })
    return 'processed'
  }

  return 'ignored'
}
