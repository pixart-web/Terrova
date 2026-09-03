import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BottleMark, PageHero, StructuredData } from '@/components/public/page-hero'
import { contentRepository, requestBrand } from '@/lib/content'
type WinePageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: WinePageProps): Promise<Metadata> {
  const [{ slug }, { brand }] = await Promise.all([params, requestBrand()])
  const wine = await contentRepository.getPublishedWine(brand.id, slug)
  return wine
    ? {
        title: wine.name,
        description: wine.introduction,
        alternates: { canonical: `/wines/${slug}` },
      }
    : { title: 'Wine not found' }
}

export default async function WinePage({ params }: WinePageProps) {
  const [{ slug }, { brand }] = await Promise.all([params, requestBrand()])
  const wine = await contentRepository.getPublishedWine(brand.id, slug)
  if (!wine) notFound()
  return (
    <main id="main-content" className="public-page wine-page">
      <PageHero
        eyebrow={`${wine.regionName ?? 'Place unknown'} / ${wine.countryName ?? ''}`}
        title={
          <>
            {wine.name}
            <br />
            <em>{wine.vintage}</em>
          </>
        }
        introduction={
          wine.introduction ?? 'A wine selected for a clear, distinctive sense of place.'
        }
      />
      <div className="wine-theatre">
        <BottleMark tone={wine.style === 'white' ? 'vine' : 'wine'} />
        <dl>
          <div>
            <dt>Producer</dt>
            <dd>{wine.producerName}</dd>
          </div>
          <div>
            <dt>Origin</dt>
            <dd>
              {wine.regionName}, {wine.countryName}
            </dd>
          </div>
          <div>
            <dt>Grapes</dt>
            <dd>{wine.grapeNames?.join(', ') || 'Field blend'}</dd>
          </div>
          <div>
            <dt>Style</dt>
            <dd>{wine.style}</dd>
          </div>
        </dl>
      </div>
      <Link className="text-link" href="/boxes">
        Discover the current edition →
      </Link>
      <StructuredData
        value={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: wine.name,
          description: wine.introduction,
          brand: { '@type': 'Brand', name: brand.name },
          category: 'Wine',
          productionDate: wine.vintage ? String(wine.vintage) : undefined,
        }}
      />
    </main>
  )
}
