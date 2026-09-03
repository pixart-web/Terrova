import { canTransitionOrder } from '../../apps/cms/src/collections/Operations'
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
})
