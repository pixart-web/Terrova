import type { ContentRepository } from '@terrova/content'
import { resolveBrandFromRegistry } from '@terrova/content'
import type {
  BoxSummary,
  BrandIdentity,
  EditorialPageContent,
  EntityID,
  GrapeVarietySummary,
  JournalEntry,
  MediaAsset,
  SiteSettings,
  SubscriptionPlan,
  WineRegionSummary,
} from '@terrova/types'

import {
  fixtureBoxes,
  fixtureBrand,
  fixtureGrapes,
  fixtureJournal,
  fixturePages,
  fixturePlans,
  fixtureRegions,
  fixtureSiteSettings,
} from './fixtures'

type PayloadDocument = Record<string, unknown> & { id: EntityID }
type PayloadList = { docs: PayloadDocument[] }

function relationship(value: unknown): PayloadDocument | undefined {
  return value && typeof value === 'object' && 'id' in value
    ? (value as PayloadDocument)
    : undefined
}

function relationshipID(value: unknown): EntityID {
  return relationship(value)?.id ?? (value as EntityID)
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function media(value: unknown): MediaAsset | undefined {
  const item = relationship(value)
  const url = text(item?.url)
  if (!item || !url) return undefined
  return {
    id: item.id,
    url,
    alt: text(item.alt),
    width: typeof item.width === 'number' ? item.width : undefined,
    height: typeof item.height === 'number' ? item.height : undefined,
  }
}

function brandFromPayload(doc: PayloadDocument): BrandIdentity {
  const hostnames = Array.isArray(doc.hostnames)
    ? doc.hostnames.map((item) => text((item as Record<string, unknown>).hostname)).filter(Boolean)
    : []
  return {
    id: doc.id,
    slug: text(doc.slug),
    name: text(doc.name),
    hostnames,
    locale: text(doc.locale, 'en-GB'),
    currency: (doc.currency ?? 'EUR') as BrandIdentity['currency'],
  }
}

function planFromPayload(doc: PayloadDocument): SubscriptionPlan {
  return {
    id: doc.id,
    brandId: relationshipID(doc.brand),
    code: text(doc.code),
    name: text(doc.name),
    positioning: text(doc.positioning),
    description: text(doc.description) || undefined,
    cadence: (doc.cadence ?? 'monthly') as SubscriptionPlan['cadence'],
    price: {
      amount: Number(doc.priceAmount ?? 0),
      currency: (doc.currency ?? 'EUR') as SubscriptionPlan['price']['currency'],
    },
    mostPopular: Boolean(doc.mostPopular),
    externalPriceId: text(doc.externalPriceId) || undefined,
    active: doc.active !== false,
  }
}

function regionFromPayload(doc: PayloadDocument): WineRegionSummary {
  return {
    id: doc.id,
    slug: text(doc.slug),
    name: text(doc.name),
    tagline: text(doc.tagline),
    description: text(doc.shortDescription),
  }
}

function grapeFromPayload(doc: PayloadDocument): GrapeVarietySummary {
  const aliases = Array.isArray(doc.aliases) ? doc.aliases : []
  return {
    id: doc.id,
    name: text(doc.name),
    aliases: aliases.map((item) => text((item as Record<string, unknown>).name)).filter(Boolean),
    type: (doc.colour ?? 'red') as GrapeVarietySummary['type'],
    tagline: text(doc.tagline),
    description: text(doc.shortDescription),
  }
}

function journalFromPayload(doc: PayloadDocument): JournalEntry {
  return {
    id: doc.id,
    slug: text(doc.slug),
    title: text(doc.title),
    excerpt: text(doc.excerpt),
    publishedAt: text(doc.publishedAt, text(doc.createdAt)),
    hero: media(doc.hero),
    body: doc.body,
  }
}

function pageFromPayload(doc: PayloadDocument): EditorialPageContent {
  const seo = doc.seo && typeof doc.seo === 'object' ? (doc.seo as Record<string, unknown>) : {}
  return {
    id: doc.id,
    slug: text(doc.slug),
    title: text(doc.title),
    eyebrow: text(doc.eyebrow) || undefined,
    introduction: text(doc.introduction) || undefined,
    body: doc.body,
    noIndex: Boolean(seo.noIndex),
  }
}

export class PayloadContentRepository implements ContentRepository {
  constructor(
    private readonly baseURL: string,
    private readonly allowFixtures = process.env.NODE_ENV !== 'production',
  ) {}

  private async list(
    collection: string,
    params: Record<string, string> = {},
  ): Promise<PayloadDocument[]> {
    const url = new URL(`/api/${collection}`, this.baseURL)
    url.searchParams.set('limit', params.limit ?? '100')
    url.searchParams.set('depth', params.depth ?? '3')
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'limit' && key !== 'depth') url.searchParams.set(key, value)
    })
    const response = await fetch(url, {
      next: { revalidate: 300, tags: [`payload:${collection}`] },
    })
    if (!response.ok) throw new Error(`Payload ${collection} request failed (${response.status})`)
    return ((await response.json()) as PayloadList).docs
  }

  private async withFallback<T>(load: () => Promise<T>, fallback: T): Promise<T> {
    try {
      const value = await load()
      if (this.allowFixtures && Array.isArray(value) && value.length === 0) return fallback
      return value
    } catch (error) {
      if (this.allowFixtures) return fallback
      throw error
    }
  }

  async resolveBrand(hostname?: string) {
    return this.withFallback(
      async () => {
        const brands = (await this.list('brands')).map(brandFromPayload)
        return resolveBrandFromRegistry(
          brands,
          hostname,
          process.env.DEFAULT_BRAND_SLUG ?? 'terrova',
        )
      },
      { brand: fixtureBrand, resolvedFrom: 'default' as const },
    )
  }

  async listPlans(brandId: EntityID) {
    return this.withFallback(
      async () =>
        (
          await this.list('plans', {
            'where[brand][equals]': String(brandId),
            'where[active][equals]': 'true',
          })
        ).map(planFromPayload),
      fixturePlans,
    )
  }

  async getPlan(brandId: EntityID, code: string) {
    return (await this.listPlans(brandId)).find((plan) => plan.code === code) ?? null
  }

  async listPublishedBoxes(brandId: EntityID) {
    return this.withFallback(async () => {
      const docs = await this.list('boxes', { 'where[brand][equals]': String(brandId) })
      return docs.map((doc): BoxSummary => {
        const edition = relationship(doc.edition)
        const plan = relationship(doc.plan)
        return {
          id: doc.id,
          name: text(doc.name),
          edition: {
            id: edition?.id ?? '',
            code: text(edition?.code),
            slug: text(edition?.slug),
            title: text(edition?.title),
            period: text(edition?.period),
            introduction: text(edition?.introduction) || undefined,
            hero: media(edition?.hero),
          },
          planCode: text(plan?.code),
        }
      })
    }, fixtureBoxes)
  }

  async listPublishedRegions() {
    return this.withFallback(
      async () => (await this.list('regions')).map(regionFromPayload),
      fixtureRegions,
    )
  }

  async listPublishedGrapes() {
    return this.withFallback(
      async () => (await this.list('grapes')).map(grapeFromPayload),
      fixtureGrapes,
    )
  }

  async listPublishedJournalEntries(brandId: EntityID) {
    return this.withFallback(
      async () =>
        (
          await this.list('journal-posts', {
            'where[brand][equals]': String(brandId),
            sort: '-publishedAt',
          })
        ).map(journalFromPayload),
      fixtureJournal,
    )
  }

  async getPublishedJournalEntry(brandId: EntityID, slug: string) {
    return (
      (await this.listPublishedJournalEntries(brandId)).find((item) => item.slug === slug) ?? null
    )
  }

  async listPublishedPages(brandId: EntityID) {
    return this.withFallback(
      async () =>
        (await this.list('pages', { 'where[brand][equals]': String(brandId) })).map(
          pageFromPayload,
        ),
      fixturePages,
    )
  }

  async getPublishedPage(brandId: EntityID, slug: string) {
    return (await this.listPublishedPages(brandId)).find((item) => item.slug === slug) ?? null
  }

  async getSiteSettings(brandId: EntityID): Promise<SiteSettings> {
    return this.withFallback(async () => {
      const [doc] = await this.list('site-settings', { 'where[brand][equals]': String(brandId) })
      if (!doc) throw new Error('Site settings are not configured')
      const countries = Array.isArray(doc.shippingCountries) ? doc.shippingCountries : []
      return {
        siteName: text(doc.siteName),
        siteUrl: text(doc.siteUrl),
        defaultTitle: text(doc.defaultTitle),
        defaultDescription: text(doc.defaultDescription),
        ageGateEnabled: doc.ageGateEnabled !== false,
        minimumAge: Number(doc.minimumAge ?? 18),
        shippingCountries: countries
          .map((item) => text((item as Record<string, unknown>).countryCode))
          .filter(Boolean),
        supportEmail: text(doc.supportEmail),
      }
    }, fixtureSiteSettings)
  }
}
