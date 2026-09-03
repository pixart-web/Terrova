import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/public/page-hero'
import { contentRepository, requestBrand } from '@/lib/content'

export const metadata: Metadata = { title: 'Producers', alternates: { canonical: '/producers' } }
export default async function ProducersPage() {
  const { brand } = await requestBrand()
  const producers = await contentRepository.listPublishedProducers(brand.id)
  return (
    <main id="main-content" className="public-page">
      <PageHero
        eyebrow="People / The hands behind the wine"
        title={
          <>
            Growers
            <br />
            before labels.
          </>
        }
        introduction="Meet the people whose decisions, patience and parcels give every Terrova edition its voice."
      />
      <section className="editorial-ledger" aria-label="Published producers">
        {producers.length ? (
          producers.map((producer, index) => (
            <article key={String(producer.id)}>
              <span>0{index + 1}</span>
              <div>
                <p>
                  {producer.region} / {producer.country}
                </p>
                <h2>
                  <Link href={`/producers/${producer.slug}`}>{producer.name}</Link>
                </h2>
                <p>{producer.introduction}</p>
              </div>
              <Link href={`/producers/${producer.slug}`} aria-label={`Read about ${producer.name}`}>
                Meet the producer →
              </Link>
            </article>
          ))
        ) : (
          <p>No producer stories are live yet.</p>
        )}
      </section>
    </main>
  )
}
