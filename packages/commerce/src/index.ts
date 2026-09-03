import type {
  Currency,
  EntityID,
  ISODate,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@terrova/types'

export type CheckoutKind = 'subscription' | 'gift' | 'box'

export interface CheckoutLine {
  referenceId: EntityID
  providerPriceId: string
  kind: CheckoutKind
  quantity: number
}

export interface CheckoutIntent {
  brandId: EntityID
  customerId?: EntityID
  customerEmail?: string
  providerCustomerId?: string
  lines: CheckoutLine[]
  successUrl: string
  cancelUrl: string
  promotionCode?: string
  metadata?: Record<string, string>
}

export interface CheckoutSession {
  id: string
  redirectUrl: string
  provider: 'stripe' | 'test'
}

export interface BillingPortalIntent {
  providerCustomerId: string
  returnUrl: string
}

export interface ProviderSubscriptionState {
  id: string
  customerId: string
  priceId?: string
  status: SubscriptionStatus
  currentPeriodStart?: ISODate
  currentPeriodEnd?: ISODate
  cancelAtPeriodEnd: boolean
}

export interface CommerceGateway {
  createCheckout(intent: CheckoutIntent): Promise<CheckoutSession>
  createBillingPortal(intent: BillingPortalIntent): Promise<{ redirectUrl: string }>
  createCustomer(input: {
    email: string
    name?: string
    metadata?: Record<string, string>
  }): Promise<{
    id: string
  }>
  retrieveSubscription(subscriptionId: string): Promise<ProviderSubscriptionState>
  syncPlan(plan: SubscriptionPlan): Promise<{ externalId: string }>
  cancelSubscription(subscriptionId: string): Promise<void>
}

export interface CommerceEvent {
  id: string
  type: string
  createdAt: ISODate
  livemode: boolean
  data: Record<string, unknown>
}

export interface CommerceEventStore {
  hasProcessed(providerEventId: string): Promise<boolean>
  markProcessing(event: CommerceEvent): Promise<void>
  markProcessed(providerEventId: string): Promise<void>
  markFailed(providerEventId: string, message: string): Promise<void>
}

export interface SubscriptionSyncTarget {
  syncSubscription(input: {
    providerSubscriptionId: string
    providerCustomerId: string
    providerPriceId?: string
    status: SubscriptionStatus
    currentPeriodStart?: ISODate
    currentPeriodEnd?: ISODate
    cancelAtPeriodEnd: boolean
    customerId?: EntityID
    brandId?: EntityID
  }): Promise<void>
  recordInvoice(input: {
    providerInvoiceId: string
    providerSubscriptionId?: string
    amountPaid: number
    currency: Currency
    paid: boolean
  }): Promise<void>
  attachCheckout(input: {
    providerCheckoutId: string
    providerCustomerId?: string
    providerSubscriptionId?: string
    customerId?: EntityID
    brandId?: EntityID
  }): Promise<void>
}

export class CommerceNotConfiguredError extends Error {
  constructor() {
    super('Commerce provider has not been configured')
    this.name = 'CommerceNotConfiguredError'
  }
}

export function mapProviderSubscriptionStatus(status: string): SubscriptionStatus {
  if (status === 'active' || status === 'trialing') return 'active'
  if (status === 'paused') return 'paused'
  if (status === 'past_due' || status === 'unpaid' || status === 'incomplete') {
    return 'payment_issue'
  }
  if (status === 'canceled' || status === 'incomplete_expired') return 'cancelled'
  return 'pending'
}

export function assertSafeReturnUrl(url: string, allowedOrigin: string): string {
  const parsed = new URL(url, allowedOrigin)
  if (parsed.origin !== new URL(allowedOrigin).origin) throw new Error('Unsafe return URL')
  return parsed.toString()
}

export { StripeCommerceGateway, parseStripeEvent } from './stripe-adapter'
export { TestCommerceGateway } from './test-adapter'
export { processCommerceEvent } from './events'
