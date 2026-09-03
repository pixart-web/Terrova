import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHero } from '@/components/public/page-hero'
import { contentRepository, requestBrand } from '@/lib/content'
import { RichText } from '@/lib/content/rich-text'

const legalSlugs = new Set([
  'terms',
  'privacy',
  'cookies',
  'shipping',
  'returns',
  'responsible-drinking',
])
type LegalPageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params
  if (!legalSlugs.has(slug)) return { title: 'Page not found' }
  const { brand } = await requestBrand()
  const page = await contentRepository.getPublishedPage(brand.id, slug)
  return page
    ? {
        title: page.title,
        description: page.introduction,
        robots: { index: !page.noIndex },
        alternates: { canonical: `/legal/${slug}` },
      }
    : { title: 'Page not found' }
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params
  if (!legalSlugs.has(slug)) notFound()
  const { brand } = await requestBrand()
  const page = await contentRepository.getPublishedPage(brand.id, slug)
  if (!page) notFound()
  return (
    <main id="main-content" className="public-page legal-page">
      <PageHero
        eyebrow={page.eyebrow ?? 'Legal / Terrova'}
        title={page.title}
        introduction={page.introduction ?? 'Operator-reviewed policy information.'}
      />
      <article>
        <RichText value={page.body} />
        {!page.body && (
          <div className="legal-placeholder" role="note">
            <h2>Legal review required</h2>
            <p>
              This production page boundary is complete, but jurisdiction-specific copy must be
              supplied and approved by qualified counsel before launch. No legal terms are
              fabricated in code.
            </p>
          </div>
        )}
      </article>
    </main>
  )
}
