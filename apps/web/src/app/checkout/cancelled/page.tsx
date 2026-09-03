import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Checkout paused', robots: { index: false } }

export default async function CheckoutCancelledPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const plan =
    typeof query.plan === 'string' && /^[a-z0-9-]+$/.test(query.plan) ? query.plan : 'drinker'
  return (
    <main id="main-content" className="status-page">
      <p className="page-eyebrow">Membership / Paused</p>
      <h1>
        The next bottle
        <br />
        can wait.
      </h1>
      <p>No subscription was created. Your plan choice remains available whenever you are ready.</p>
      <Link className="button-link" href={`/boxes?plan=${plan}`}>
        Return to {plan}
      </Link>
    </main>
  )
}
