import Stripe from 'stripe'

import type {
  CheckoutIntent,
  CommerceEvent,
  CommerceGateway,
  ProviderSubscriptionState,
} from './index'
import {
  assertSubscriptionCustomerAssociation,
  CommerceNotConfiguredError,
  mapProviderSubscriptionStatus,
} from './index'

function timestamp(value?: number | null): string | undefined {
  return value ? new Date(value * 1000).toISOString() : undefined
}

function reference(value: string | Stripe.Customer | Stripe.DeletedCustomer | null): string {
  return typeof value === 'string' ? value : (value?.id ?? '')
}

export class StripeCommerceGateway implements CommerceGateway {
  private readonly stripe: Stripe

  constructor(secretKey: string | undefined) {
    if (!secretKey) throw new CommerceNotConfiguredError()
    this.stripe = new Stripe(secretKey, { appInfo: { name: 'Terrova', version: '0.1.0' } })
  }

  async createCheckout(intent: CheckoutIntent) {
    assertSubscriptionCustomerAssociation(intent)
    const subscription = intent.lines.some((line) => line.kind === 'subscription')
    if (subscription && intent.lines.some((line) => line.kind !== 'subscription')) {
      throw new Error('Subscription checkout cannot mix one-time items')
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: subscription ? 'subscription' : 'payment',
      line_items: intent.lines.map((line) => ({
        price: line.providerPriceId,
        quantity: line.quantity,
      })),
      success_url: intent.successUrl,
      cancel_url: intent.cancelUrl,
      customer: intent.providerCustomerId,
      customer_email: intent.providerCustomerId ? undefined : intent.customerEmail,
      client_reference_id: intent.customerId ? String(intent.customerId) : undefined,
      allow_promotion_codes: !intent.promotionCode,
      discounts: intent.promotionCode ? [{ promotion_code: intent.promotionCode }] : undefined,
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: ['PT'] },
      metadata: {
        brandId: String(intent.brandId),
        customerId: intent.customerId ? String(intent.customerId) : '',
        ...intent.metadata,
      },
      subscription_data: subscription
        ? {
            metadata: {
              brandId: String(intent.brandId),
              customerId: intent.customerId ? String(intent.customerId) : '',
              ...intent.metadata,
            },
          }
        : undefined,
    })

    if (!session.url) throw new Error('Stripe did not return a checkout URL')
    return { id: session.id, redirectUrl: session.url, provider: 'stripe' as const }
  }

  async createBillingPortal(input: { providerCustomerId: string; returnUrl: string }) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: input.providerCustomerId,
      return_url: input.returnUrl,
    })
    return { redirectUrl: session.url }
  }

  async createCustomer(input: { email: string; name?: string; metadata?: Record<string, string> }) {
    const customer = await this.stripe.customers.create(input)
    return { id: customer.id }
  }

  async retrieveSubscription(subscriptionId: string): Promise<ProviderSubscriptionState> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
    const firstItem = subscription.items.data[0]
    return {
      id: subscription.id,
      customerId: reference(subscription.customer),
      priceId: firstItem?.price.id,
      status: mapProviderSubscriptionStatus(subscription.status),
      currentPeriodStart: timestamp(firstItem?.current_period_start),
      currentPeriodEnd: timestamp(firstItem?.current_period_end),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    }
  }

  async syncPlan(plan: { externalPriceId?: string }) {
    if (!plan.externalPriceId) throw new Error('Plan is missing its Stripe Price reference')
    await this.stripe.prices.retrieve(plan.externalPriceId)
    return { externalId: plan.externalPriceId }
  }

  async cancelSubscription(subscriptionId: string) {
    await this.stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true })
  }
}

export function parseStripeEvent(
  secretKey: string | undefined,
  webhookSecret: string | undefined,
  payload: string,
  signature: string | null,
): CommerceEvent {
  if (!secretKey || !webhookSecret) throw new CommerceNotConfiguredError()
  if (!signature) throw new Error('Missing Stripe signature')

  const stripe = new Stripe(secretKey, { appInfo: { name: 'Terrova', version: '0.1.0' } })
  const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

  return {
    id: event.id,
    type: event.type,
    createdAt: new Date(event.created * 1000).toISOString(),
    livemode: event.livemode,
    data: event.data.object as unknown as Record<string, unknown>,
  }
}
