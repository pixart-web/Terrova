import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Journey confirmed', robots: { index: false } }

export default function CheckoutSuccessPage() {
  return (
    <main id="main-content" className="status-page">
      <p className="page-eyebrow">Membership / Confirmed</p>
      <h1>
        Your journey
        <br />
        has begun.
      </h1>
      <p>
        Billing truth is synchronized by the signed provider webhook. My Terrova will reflect the
        subscription as soon as that event is processed.
      </p>
      <Link className="button-link" href="/account">
        Open My Terrova
      </Link>
    </main>
  )
}
