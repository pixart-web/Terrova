import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/public/page-hero'
import { contentRepository, requestBrand } from '@/lib/content'

export const metadata: Metadata = { title: 'Journal', alternates: { canonical: '/journal' } }
export default async function JournalPage() {
  const { brand } = await requestBrand()
  const entries = await contentRepository.listPublishedJournalEntries(brand.id)
  return (
    <main id="main-content" className="public-page journal-page">
      <PageHero
        eyebrow="Field notes / Journal"
        title={
          <>
            Stories with soil
            <br />
            under their nails.
          </>
        }
        introduction="Dispatches from cellars, coastlines and tables — edited to deepen the pleasure of the bottle."
      />
      <section className="journal-index" aria-label="Published field notes">
        {entries.length ? (
          entries.map((entry, index) => (
            <article key={String(entry.id)}>
              <p>
                {new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(
                  new Date(entry.publishedAt),
                )}
              </p>
              <span>0{index + 1}</span>
              <h2>
                <Link href={`/journal/${entry.slug}`}>{entry.title}</Link>
              </h2>
              <p>{entry.excerpt}</p>
            </article>
          ))
        ) : (
          <p>No field notes are live yet.</p>
        )}
      </section>
    </main>
  )
}
