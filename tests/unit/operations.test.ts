import {
  canTransitionOrder,
  inventoryBalances,
  reservationReleaseReference,
  shouldReleaseOrderReservations,
} from '../../apps/cms/src/collections/Operations'
import { describe, expect, it } from 'vitest'

describe('order lifecycle', () => {
  it('allows the fulfilment happy path', () => {
    expect(canTransitionOrder('pending', 'paid')).toBe(true)
    expect(canTransitionOrder('paid', 'preparing')).toBe(true)
    expect(canTransitionOrder('preparing', 'shipped')).toBe(true)
    expect(canTransitionOrder('shipped', 'delivered')).toBe(true)
  })

  it('blocks state skipping and reopening terminal orders', () => {
    expect(canTransitionOrder('pending', 'shipped')).toBe(false)
    expect(canTransitionOrder('cancelled', 'paid')).toBe(false)
    expect(canTransitionOrder('refunded', 'preparing')).toBe(false)
  })

  it('releases a preparing reservation exactly once for cancelled and refunded orders', () => {
    expect(shouldReleaseOrderReservations('preparing', 'cancelled')).toBe(true)
    expect(shouldReleaseOrderReservations('preparing', 'refunded')).toBe(true)
    expect(shouldReleaseOrderReservations('paid', 'cancelled')).toBe(false)
    expect(reservationReleaseReference(12, 8, 0)).toBe(reservationReleaseReference(12, 8, 0))
    expect(inventoryBalances(10, 2, 0, -2)).toEqual({ next: 10, nextReserved: 0 })
    expect(() => inventoryBalances(10, 0, 0, -2)).toThrow('sellable stock negative')
  })
})
