import type { Metadata } from 'next'

import { PageHero } from '@/components/public/page-hero'
import { contentRepository, requestBrand } from '@/lib/content'

const regionOrder = ['Douro', 'Alentejo', 'Vinho Verde', 'Dão', 'Bairrada']
const grapeOrder = ['Touriga Nacional', 'Alvarinho', 'Arinto', 'Baga', 'Aragonez']

export const metadata: Metadata = {
  title: 'Portuguese wine origins',
  description: 'Discover five Portuguese wine regions and five native grape varieties.',
  alternates: { canonical: '/producers' },
}

export default async function ProducersPage() {
  await requestBrand()
  const [allRegions, allGrapes] = await Promise.all([
    contentRepository.listPublishedRegions(),
    contentRepository.listPublishedGrapes(),
  ])
  const regions = allRegions
    .filter((region) => regionOrder.includes(region.name))
    .sort((a, b) => regionOrder.indexOf(a.name) - regionOrder.indexOf(b.name))
  const grapes = allGrapes
    .filter((grape) => grapeOrder.includes(grape.name))
    .sort((a, b) => grapeOrder.indexOf(a.name) - grapeOrder.indexOf(b.name))

  return (
    <main id="main-content" className="public-page">
      <PageHero
        eyebrow="Portugal / Regions and native grapes"
        title={
          <>
            Begin with
            <br />
            the place.
          </>
        }
        introduction="Explore the landscapes and varieties behind Terrova. The producers and bottles in each surprise box are revealed only when it is opened."
      />
      <section className="editorial-ledger" aria-labelledby="regions-title">
        <div className="section-heading">
          <p>01 / Portuguese regions</p>
          <h2 id="regions-title">Five landscapes to discover.</h2>
        </div>
        {regions.map((region, index) => (
          <article key={String(region.id)}>
            <span>0{index + 1}</span>
            <div>
              <p>Portugal / Wine region</p>
              <h3>{region.name}</h3>
              <p>{region.tagline}</p>
            </div>
            <p>{region.description}</p>
          </article>
        ))}
      </section>
      <section className="editorial-ledger" aria-labelledby="grapes-title">
        <div className="section-heading">
          <p>02 / Native grapes</p>
          <h2 id="grapes-title">Five Portuguese signatures.</h2>
        </div>
        {grapes.map((grape, index) => (
          <article key={String(grape.id)}>
            <span>0{index + 1}</span>
            <div>
              <p>{grape.type} grape / Portugal</p>
              <h3>
                {grape.name}
                {grape.aliases.length ? ` / ${grape.aliases.join(' / ')}` : ''}
              </h3>
              <p>{grape.tagline}</p>
            </div>
            <p>{grape.description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
