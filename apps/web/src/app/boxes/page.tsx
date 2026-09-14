import type { Metadata } from 'next'
import Link from 'next/link'

import { BottleMark, PageHero, StructuredData } from '@/components/public/page-hero'
import { CheckoutResume } from '@/components/checkout-resume'
import { contentRepository, requestBrand } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Wine discovery boxes',
  description:
    'Choose a monthly surprise box of Portuguese wines, revealed only when it reaches you.',
  alternates: { canonical: '/boxes' },
}

function money(amount: number, currency: string) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency }).format(amount / 100)
}

export default async function BoxesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ brand }, query] = await Promise.all([requestBrand(), searchParams])
  const [plans, boxes] = await Promise.all([
    contentRepository.listPlans(brand.id),
    contentRepository.listPublishedBoxes(brand.id),
  ])
  const requested = typeof query.plan === 'string' ? query.plan : undefined
  const promo = typeof query.promo === 'string' ? query.promo.slice(0, 80) : undefined
  const selected =
    plans.find((plan) => plan.code === requested) ??
    plans.find((plan) => plan.mostPopular) ??
    plans[0]

  return (
    <main id="main-content" className="public-page boxes-page">
      <PageHero
        eyebrow="Membership / Monthly discoveries"
        title={
          <>
            Choose a rhythm,
            <br />
            not a routine.
          </>
        }
        introduction="Each Terrova box is a sealed Portuguese wine discovery. You choose the journey; the bottles and producers remain unknown until you open it."
      />
      {query.error && (
        <p className="notice" role="alert">
          Checkout is not configured for this environment yet. Your selection has been kept.
        </p>
      )}
      {query.resume === '1' && selected && <CheckoutResume plan={selected.code} promo={promo} />}

      <section className="plan-ledger" aria-labelledby="plans-title">
        <div className="section-heading">
          <p>01 / Your journey</p>
          <h2 id="plans-title">
            Three ways
            <br />
            into the unknown.
          </h2>
        </div>
        <nav aria-label="Choose a membership plan" className="plan-index">
          {plans.map((plan, index) => (
            <Link
              key={String(plan.id)}
              href={`/boxes?plan=${plan.code}`}
              aria-current={plan.code === selected?.code ? 'true' : undefined}
            >
              <span>0{index + 1}</span>
              <strong>{plan.name}</strong>
              <span>{money(plan.price.amount, plan.price.currency)}</span>
            </Link>
          ))}
        </nav>
        {selected && (
          <article className="selected-plan">
            <BottleMark
              tone={
                selected.code === 'taster'
                  ? 'terracotta'
                  : selected.code === 'premium'
                    ? 'vine'
                    : 'wine'
              }
            />
            <div>
              <p>{selected.mostPopular ? 'Most popular / ' : ''}Monthly</p>
              <h2>{selected.positioning}</h2>
              <p>{selected.description}</p>
              <p className="selected-plan__price">
                {money(selected.price.amount, selected.price.currency)} <span>/ month</span>
              </p>
              <form action="/api/commerce/checkout" method="post" className="checkout-entry">
                <input type="hidden" name="plan" value={selected.code} />
                <label>
                  Promotion code <input name="promo" autoComplete="off" maxLength={80} />
                </label>
                <button type="submit">Begin with {selected.name}</button>
              </form>
              {!selected.externalPriceId && (
                <p className="configuration-note">
                  Checkout becomes available when this plan receives its Stripe Price reference in
                  the Studio.
                </p>
              )}
            </div>
          </article>
        )}
      </section>

      <section className="edition-ledger" aria-labelledby="edition-title">
        <div className="section-heading">
          <p>02 / The surprise</p>
          <h2 id="edition-title">
            A discovery,
            <br />
            kept sealed.
          </h2>
        </div>
        {boxes.length ? (
          boxes.map((box) => (
            <article key={String(box.id)}>
              <p>
                {box.edition.period} / {box.edition.code}
              </p>
              <h3>Meet the wines when the box opens.</h3>
              <p>
                Every edition brings together Portuguese regions and native grapes without
                previewing its producers, labels or bottles in advance.
              </p>
            </article>
          ))
        ) : (
          <p>Membership remains available while the next surprise edition is curated in private.</p>
        )}
      </section>

      <StructuredData
        value={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: brand.name,
          url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://terrova.net',
          slogan: 'Discover wine beyond the label.',
        }}
      />
    </main>
  )
}
