import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHero, StructuredData } from '@/components/public/page-hero'
import { contentRepository, requestBrand } from '@/lib/content'
import { RichText } from '@/lib/content/rich-text'

type EntryPageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: EntryPageProps): Promise<Metadata> {
  const [{ slug }, { brand }] = await Promise.all([params, requestBrand()])
  const entry = await contentRepository.getPublishedJournalEntry(brand.id, slug)
  return entry
    ? {
        title: entry.title,
        description: entry.excerpt,
        alternates: { canonical: `/journal/${slug}` },
      }
    : { title: 'Field note not found' }
}

export default async function JournalEntryPage({ params }: EntryPageProps) {
  const [{ slug }, { brand }] = await Promise.all([params, requestBrand()])
  const entry = await contentRepository.getPublishedJournalEntry(brand.id, slug)
  if (!entry) notFound()
  return (
    <main id="main-content" className="public-page article-page">
      <PageHero
        eyebrow={`Journal / ${new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(entry.publishedAt))}`}
        title={entry.title}
        introduction={entry.excerpt}
      />
      <article>
        <RichText value={entry.body} />
        {!entry.body && (
          <p>
            This field note is available as an editorial preview. Its full CMS-authored body will
            appear after publication.
          </p>
        )}
      </article>
      <StructuredData
        value={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: entry.title,
          description: entry.excerpt,
          datePublished: entry.publishedAt,
          publisher: { '@type': 'Organization', name: brand.name },
        }}
      />
    </main>
  )
}
