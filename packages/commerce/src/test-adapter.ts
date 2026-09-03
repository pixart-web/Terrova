import type { CheckoutIntent, CommerceGateway, ProviderSubscriptionState } from './index'

export class TestCommerceGateway implements CommerceGateway {
  async createCheckout(intent: CheckoutIntent) {
    const url = new URL(intent.successUrl)
    url.searchParams.set('session_id', 'cs_test_terrova_fixture')
    return { id: 'cs_test_terrova_fixture', redirectUrl: url.toString(), provider: 'test' as const }
  }

  async createBillingPortal({ returnUrl }: { providerCustomerId: string; returnUrl: string }) {
    return { redirectUrl: returnUrl }
  }

  async createCustomer() {
    return { id: 'cus_test_terrova_fixture' }
  }

  async retrieveSubscription(subscriptionId: string): Promise<ProviderSubscriptionState> {
    return {
      id: subscriptionId,
      customerId: 'cus_test_terrova_fixture',
      priceId: 'price_test_terrova_fixture',
      status: 'active',
      cancelAtPeriodEnd: false,
    }
  }

  async syncPlan(plan: { externalPriceId?: string }) {
    return { externalId: plan.externalPriceId ?? 'price_test_terrova_fixture' }
  }

  async cancelSubscription() {}
}
