import type { Metadata } from 'next'
import { PageHero } from '@/components/public/page-hero'
import { contentRepository, requestBrand } from '@/lib/content'

export const metadata: Metadata = { title: 'Gifts', alternates: { canonical: '/gifts' } }
export default async function GiftsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ brand }, query] = await Promise.all([requestBrand(), searchParams])
  const plans = await contentRepository.listPlans(brand.id)
  return (
    <main id="main-content" className="public-page gifts-page">
      <PageHero
        eyebrow="Give a place / Gift intent"
        title={
          <>
            An invitation,
            <br />
            wrapped as wine.
          </>
        }
        introduction="Begin a considered gift journey. We capture the recipient, timing and plan without inventing fulfilment rules that have not yet been approved."
      />
      {query.submitted && (
        <p className="notice" role="status">
          Your gift intent is safely recorded. Terrova will contact the purchaser when gift duration
          and fulfilment terms are approved.
        </p>
      )}
      {query.error && (
        <p className="notice" role="alert">
          We could not record that gift. Review the details and try again.
        </p>
      )}
      <section className="gift-composition">
        <div>
          <p>01 / The gesture</p>
          <h2>
            A message now.
            <br />A place later.
          </h2>
          <p>
            Gift billing is deliberately held until duration, redemption and fulfilment policy
            receive business approval.
          </p>
        </div>
        <form action="/api/gifts" method="post" className="editorial-form">
          <label>
            Your email
            <input type="email" name="purchaserEmail" autoComplete="email" required />
          </label>
          <label>
            Recipient name
            <input name="recipientName" autoComplete="name" required />
          </label>
          <label>
            Recipient email
            <input type="email" name="recipientEmail" required />
          </label>
          <label>
            Journey
            <select name="plan" required>
              {plans.map((plan) => (
                <option key={String(plan.id)} value={plan.code}>
                  {plan.name} — {plan.positioning}
                </option>
              ))}
            </select>
          </label>
          <label>
            Preferred start
            <input name="startsAt" type="date" />
          </label>
          <label>
            Your note
            <textarea name="message" rows={5} maxLength={1000} />
          </label>
          <button type="submit">Save gift intent</button>
        </form>
      </section>
    </main>
  )
}
