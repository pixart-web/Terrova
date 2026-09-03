import type {
  BoxSummary,
  BrandIdentity,
  EntityID,
  EditorialPageContent,
  JournalEntry,
  ProducerSummary,
  SiteSettings,
  SubscriptionPlan,
  WineIdentity,
} from '@terrova/types'

export interface BrandContext {
  brand: BrandIdentity
  resolvedFrom: 'hostname' | 'default'
}

export interface ContentRepository {
  resolveBrand(hostname?: string): Promise<BrandContext>
  listPlans(brandId: EntityID): Promise<SubscriptionPlan[]>
  getPlan(brandId: EntityID, code: string): Promise<SubscriptionPlan | null>
  listPublishedBoxes(brandId: EntityID): Promise<BoxSummary[]>
  listPublishedProducers(brandId: EntityID): Promise<ProducerSummary[]>
  getPublishedProducer(brandId: EntityID, slug: string): Promise<ProducerSummary | null>
  listPublishedWines(brandId: EntityID): Promise<WineIdentity[]>
  getPublishedWine(brandId: EntityID, slug: string): Promise<WineIdentity | null>
  listPublishedJournalEntries(brandId: EntityID): Promise<JournalEntry[]>
  getPublishedJournalEntry(brandId: EntityID, slug: string): Promise<JournalEntry | null>
  listPublishedPages(brandId: EntityID): Promise<EditorialPageContent[]>
  getPublishedPage(brandId: EntityID, slug: string): Promise<EditorialPageContent | null>
  getSiteSettings(brandId: EntityID): Promise<SiteSettings>
}

export function normalizeHostname(hostname?: string): string | undefined {
  if (!hostname) return undefined
  return hostname
    .trim()
    .toLowerCase()
    .split(':')[0]
    .replace(/\.$/, '')
    .replace(/^www\./, '')
}

export function resolveBrandFromRegistry(
  brands: BrandIdentity[],
  hostname: string | undefined,
  defaultSlug: string,
): BrandContext {
  const normalized = normalizeHostname(hostname)
  const matched = normalized
    ? brands.find((brand) => brand.hostnames.some((item) => normalizeHostname(item) === normalized))
    : undefined
  const fallback = brands.find((brand) => brand.slug === defaultSlug) ?? brands[0]

  if (!matched && !fallback) throw new Error('No brand is configured')
  return { brand: matched ?? fallback, resolvedFrom: matched ? 'hostname' : 'default' }
}

export { aggregateTasteProfile } from './taste-profile'
export type { TasteObservation } from './taste-profile'
