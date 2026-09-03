import type { Metadata } from 'next'
import Link from 'next/link'

import { BottleMark, PageHero, StructuredData } from '@/components/public/page-hero'
import { contentRepository, requestBrand } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Wine discovery boxes',
  description: 'Choose a monthly Terrova journey shaped by remarkable wines, makers and places.',
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
        introduction="Each Terrova edition studies place through a small constellation of bottles. The point is not more wine. It is a wider view."
      />
      {query.error && (
        <p className="notice" role="alert">
          Checkout is not configured for this environment yet. Your selection has been kept.
        </p>
      )}

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
          <p>02 / Current edition</p>
          <h2 id="edition-title">
            A place,
            <br />
            opened slowly.
          </h2>
        </div>
        {boxes.length ? (
          boxes.map((box) => (
            <article key={String(box.id)}>
              <p>
                {box.edition.period} / {box.edition.code}
              </p>
              <h3>{box.edition.title}</h3>
              <p>{box.edition.introduction}</p>
              <ul>
                {box.wines.map((wine) => (
                  <li key={String(wine.id)}>
                    <Link href={`/wines/${wine.slug}`}>{wine.name}</Link>
                    <span>{wine.regionName}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))
        ) : (
          <p>
            No live edition is published yet. Membership remains available; the next edition will
            appear after editorial approval.
          </p>
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
