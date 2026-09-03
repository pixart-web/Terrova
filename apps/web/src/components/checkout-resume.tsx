'use client'

import { useEffect, useRef } from 'react'

export function CheckoutResume({ plan, promo }: { plan: string; promo?: string }) {
  const form = useRef<HTMLFormElement>(null)
  const submitted = useRef(false)

  useEffect(() => {
    if (submitted.current) return
    submitted.current = true
    form.current?.requestSubmit()
  }, [])

  return (
    <form ref={form} action="/api/commerce/checkout" method="post" className="checkout-resume">
      <input type="hidden" name="plan" value={plan} />
      {promo && <input type="hidden" name="promo" value={promo} />}
      <p role="status">Your account is ready. Continuing to secure checkout…</p>
      <button type="submit">Continue to checkout</button>
    </form>
  )
}
