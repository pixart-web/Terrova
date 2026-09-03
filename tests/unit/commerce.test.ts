import {
  assertSubscriptionCustomerAssociation,
  assertSafeReturnUrl,
  mapProviderSubscriptionStatus,
  processCommerceEvent,
  type SubscriptionSyncTarget,
} from '../../packages/commerce/src/index'
import {
  PayloadSubscriptionSyncTarget,
  providerStateDecision,
} from '../../apps/web/src/lib/commerce/payload-store'
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

  it('rejects subscription checkout without both internal and provider customer association', () => {
    const intent = {
      brandId: 'brand-1',
      lines: [
        {
          referenceId: 'plan-1',
          providerPriceId: 'price_1',
          kind: 'subscription' as const,
          quantity: 1,
        },
      ],
      successUrl: 'https://terrova.net/checkout/success',
      cancelUrl: 'https://terrova.net/boxes',
    }
    expect(() => assertSubscriptionCustomerAssociation(intent)).toThrow('associated customer')
    expect(() =>
      assertSubscriptionCustomerAssociation({
        ...intent,
        customerId: 'customer-1',
        providerCustomerId: 'cus_1',
      }),
    ).not.toThrow()
  })

  it('prevents old or same-second events and terminal cancellation from regressing state', () => {
    expect(
      providerStateDecision({
        lastProviderEventAt: '2026-09-03T10:00:00.000Z',
        currentStatus: 'cancelled',
        providerEventAt: '2026-09-03T09:59:59.000Z',
        incomingStatus: 'active',
      }),
    ).toBe('stale')
    expect(
      providerStateDecision({
        lastProviderEventAt: '2026-09-03T10:00:00.000Z',
        currentStatus: 'payment_issue',
        providerEventAt: '2026-09-03T10:00:00.000Z',
        incomingStatus: 'active',
      }),
    ).toBe('stale')
    expect(
      providerStateDecision({
        lastProviderEventAt: '2026-09-03T10:00:00.000Z',
        currentStatus: 'cancelled',
        providerEventAt: '2026-09-03T10:00:01.000Z',
        incomingStatus: 'active',
      }),
    ).toBe('timestamp-only')
  })

  it('does not let late invoice.paid reactivate a cancelled subscription', async () => {
    vi.stubEnv('CMS_SERVICE_TOKEN', 'unit-test-service-token')
    const requests: Array<{ url: string; init?: RequestInit }> = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
        const url = String(input)
        requests.push({ url, init })
        if (url.includes('/api/subscriptions?')) {
          return Response.json({
            docs: [
              {
                id: 7,
                status: 'cancelled',
                lastProviderEventAt: '2026-09-03T10:00:00.000Z',
                brand: 1,
                customer: 2,
              },
            ],
            totalDocs: 1,
          })
        }
        if (url.includes('/api/orders?')) {
          return Response.json({ docs: [{ id: 9 }], totalDocs: 1 })
        }
        return Response.json({ doc: { id: 7 } })
      }),
    )

    const sync = new PayloadSubscriptionSyncTarget()
    await sync.recordInvoice({
      providerInvoiceId: 'in_late',
      providerSubscriptionId: 'sub_1',
      amountPaid: 4999,
      currency: 'EUR',
      paid: true,
      providerEventAt: '2026-09-03T09:59:00.000Z',
      providerEventId: 'evt_late',
    })
    expect(requests.some(({ init }) => init?.method === 'PATCH')).toBe(false)

    requests.length = 0
    await sync.recordInvoice({
      providerInvoiceId: 'in_newer',
      providerSubscriptionId: 'sub_1',
      amountPaid: 4999,
      currency: 'EUR',
      paid: true,
      providerEventAt: '2026-09-03T10:01:00.000Z',
      providerEventId: 'evt_newer',
    })
    const patch = requests.find(({ init }) => init?.method === 'PATCH')
    expect(JSON.parse(String(patch?.init?.body))).toMatchObject({
      status: 'cancelled',
      lastProviderEventAt: '2026-09-03T10:01:00.000Z',
    })
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
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
        providerEventAt: '2026-09-02T00:00:00.000Z',
        providerEventId: 'evt_1',
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
