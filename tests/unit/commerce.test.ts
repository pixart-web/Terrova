import {
  assertSafeReturnUrl,
  mapProviderSubscriptionStatus,
  processCommerceEvent,
  type SubscriptionSyncTarget,
} from '../../packages/commerce/src/index'
import { describe, expect, it, vi } from 'vitest'

function target(): SubscriptionSyncTarget {
  return { syncSubscription: vi.fn(), recordInvoice: vi.fn(), attachCheckout: vi.fn() }
}

describe('commerce boundaries', () => {
  it('rejects an off-site billing return URL', () => {
    expect(() => assertSafeReturnUrl('https://attacker.invalid', 'https://terrova.net')).toThrow(
      'Unsafe',
    )
  })

  it('maps provider lifecycle states without leaking Stripe into the domain', () => {
    expect(mapProviderSubscriptionStatus('trialing')).toBe('active')
    expect(mapProviderSubscriptionStatus('past_due')).toBe('payment_issue')
    expect(mapProviderSubscriptionStatus('canceled')).toBe('cancelled')
  })

  it('turns a subscription webhook into a provider-neutral sync command', async () => {
    const syncTarget = target()
    const result = await processCommerceEvent(
      {
        id: 'evt_1',
        type: 'customer.subscription.updated',
        createdAt: '2026-09-02T00:00:00.000Z',
        livemode: false,
        data: {
          id: 'sub_1',
          customer: 'cus_1',
          status: 'active',
          cancel_at_period_end: false,
          metadata: { customerId: '42', brandId: '1' },
          items: {
            data: [
              {
                current_period_start: 1788307200,
                current_period_end: 1790899200,
                price: { id: 'price_1' },
              },
            ],
          },
        },
      },
      syncTarget,
    )
    expect(result).toBe('processed')
    expect(syncTarget.syncSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        providerSubscriptionId: 'sub_1',
        status: 'active',
        providerPriceId: 'price_1',
        customerId: '42',
      }),
    )
  })

  it('ignores unknown provider events', async () => {
    expect(
      await processCommerceEvent(
        {
          id: 'evt_x',
          type: 'charge.dispute.created',
          createdAt: '2026-09-02T00:00:00.000Z',
          livemode: false,
          data: {},
        },
        target(),
      ),
    ).toBe('ignored')
  })
})
