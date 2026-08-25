import type { EntityID, Money, SubscriptionPlan } from '@terrova/types'

export interface CheckoutLine {
  referenceId: EntityID
  kind: 'plan' | 'gift' | 'box'
  quantity: number
  unitPrice: Money
}

export interface CheckoutIntent {
  brandId: EntityID
  customerId?: EntityID
  lines: CheckoutLine[]
  successPath: string
  cancelPath: string
}

export interface CheckoutSession {
  id: string
  redirectUrl: string
  provider: 'stripe'
}

/** Provider boundary. A Stripe adapter will implement this later. */
export interface CommerceGateway {
  createCheckout(intent: CheckoutIntent): Promise<CheckoutSession>
  syncPlan(plan: SubscriptionPlan): Promise<{ externalId: string }>
  cancelSubscription(subscriptionId: string): Promise<void>
}

export class CommerceNotConfiguredError extends Error {
  constructor() {
    super('Commerce provider has not been configured')
  }
}
