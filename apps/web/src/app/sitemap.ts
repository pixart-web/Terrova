import type { MetadataRoute } from 'next'

import { contentRepository } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://terrova.net'
  const { brand } = await contentRepository.resolveBrand()
  const [producers, wines, journal, pages] = await Promise.all([
    contentRepository.listPublishedProducers(brand.id),
    contentRepository.listPublishedWines(brand.id),
    contentRepository.listPublishedJournalEntries(brand.id),
    contentRepository.listPublishedPages(brand.id),
  ])
  const path = (pathname: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: new URL(pathname, siteURL).toString(),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority,
  })
  return [
    path('/', 1),
    path('/boxes', 0.9),
    path('/producers', 0.8),
    path('/journal', 0.8),
    path('/gifts', 0.7),
    ...producers.map((item) => path(`/producers/${item.slug}`, 0.7)),
    ...wines.map((item) => path(`/wines/${item.slug}`, 0.7)),
    ...journal.map((item) => path(`/journal/${item.slug}`, 0.7)),
    ...pages.map((item) => path(`/legal/${item.slug}`, 0.3)),
  ]
}
