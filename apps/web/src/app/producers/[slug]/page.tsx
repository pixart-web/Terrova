import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageHero, StructuredData } from '@/components/public/page-hero'
import { contentRepository, requestBrand } from '@/lib/content'
type ProducerPageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: ProducerPageProps): Promise<Metadata> {
  const [{ slug }, { brand }] = await Promise.all([params, requestBrand()])
  const producer = await contentRepository.getPublishedProducer(brand.id, slug)
  return producer
    ? {
        title: producer.name,
        description: producer.introduction,
        alternates: { canonical: `/producers/${slug}` },
      }
    : { title: 'Producer not found' }
}

export default async function ProducerPage({ params }: ProducerPageProps) {
  const [{ slug }, { brand }] = await Promise.all([params, requestBrand()])
  const producer = await contentRepository.getPublishedProducer(brand.id, slug)
  if (!producer) notFound()
  const wines = (await contentRepository.listPublishedWines(brand.id)).filter(
    (wine) => String(wine.producerId) === String(producer.id),
  )
  return (
    <main id="main-content" className="public-page detail-page">
      <PageHero
        eyebrow={`${producer.region ?? 'Unknown parcel'} / ${producer.country}`}
        title={producer.name}
        introduction={
          producer.introduction ?? 'A producer selected for a distinctive reading of place.'
        }
      />
      <section className="detail-story">
        <p>Producer profile</p>
        <h2>
          Decisions made
          <br />
          close to the land.
        </h2>
        <p>
          Terrova publishes only approved producer narratives from the Studio. Full documentary
          photography will replace this restrained study when rights-cleared assets are available.
        </p>
      </section>
      <section className="related-ledger">
        <h2>Wines in the Terrova atlas</h2>
        {wines.length ? (
          wines.map((wine) => (
            <Link key={String(wine.id)} href={`/wines/${wine.slug}`}>
              <span>{wine.name}</span>
              <span>{wine.vintage}</span>
              <span>{wine.style}</span>
            </Link>
          ))
        ) : (
          <p>No live wines are currently linked to this producer.</p>
        )}
      </section>
      <StructuredData
        value={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: producer.name,
          address: {
            '@type': 'PostalAddress',
            addressCountry: producer.country,
            addressRegion: producer.region,
          },
        }}
      />
    </main>
  )
}
