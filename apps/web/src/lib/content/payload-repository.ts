import type { ContentRepository } from '@terrova/content'
import { resolveBrandFromRegistry } from '@terrova/content'
import type {
  BoxSummary,
  BrandIdentity,
  EditorialPageContent,
  EntityID,
  JournalEntry,
  MediaAsset,
  ProducerSummary,
  SiteSettings,
  SubscriptionPlan,
  WineIdentity,
  WineStyle,
} from '@terrova/types'

import {
  fixtureBoxes,
  fixtureBrand,
  fixtureJournal,
  fixturePages,
  fixturePlans,
  fixtureProducers,
  fixtureSiteSettings,
  fixtureWines,
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

function producerFromPayload(doc: PayloadDocument): ProducerSummary {
  return {
    id: doc.id,
    slug: text(doc.slug),
    name: text(doc.name),
    region: text(relationship(doc.region)?.name) || undefined,
    country: text(relationship(doc.country)?.name),
    introduction: text(doc.introduction) || undefined,
    portrait: media(doc.portrait),
  }
}

function wineFromPayload(doc: PayloadDocument): WineIdentity {
  const grapes = Array.isArray(doc.grapes) ? doc.grapes : []
  return {
    id: doc.id,
    brandId: relationshipID(doc.brand),
    slug: text(doc.slug),
    name: text(doc.name),
    producerId: relationshipID(doc.producer),
    producerName: text(relationship(doc.producer)?.name) || undefined,
    regionId: relationshipID(doc.region),
    regionName: text(relationship(doc.region)?.name) || undefined,
    countryName: text(relationship(doc.country)?.name) || undefined,
    grapeIds: grapes.map(relationshipID),
    grapeNames: grapes.map((item) => text(relationship(item)?.name)).filter(Boolean),
    vintage: typeof doc.vintage === 'number' ? doc.vintage : undefined,
    style: text(doc.style) ? (doc.style as WineStyle) : undefined,
    introduction: text(doc.introduction) || undefined,
    label: media(doc.label),
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
        const skus = Array.isArray(doc.wineSKUs)
          ? doc.wineSKUs.map(relationship).filter((item): item is PayloadDocument => Boolean(item))
          : []
        const wines = skus
          .map((sku) => relationship(sku.wine))
          .filter((item): item is PayloadDocument => Boolean(item))
          .map(wineFromPayload)
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
          wines,
        }
      })
    }, fixtureBoxes)
  }

  async listPublishedProducers(brandId: EntityID) {
    return this.withFallback(
      async () =>
        (await this.list('producers', { 'where[brands][contains]': String(brandId) })).map(
          producerFromPayload,
        ),
      fixtureProducers,
    )
  }

  async getPublishedProducer(brandId: EntityID, slug: string) {
    return (await this.listPublishedProducers(brandId)).find((item) => item.slug === slug) ?? null
  }

  async listPublishedWines(brandId: EntityID) {
    return this.withFallback(
      async () =>
        (await this.list('wines', { 'where[brand][equals]': String(brandId) })).map(
          wineFromPayload,
        ),
      fixtureWines,
    )
  }

  async getPublishedWine(brandId: EntityID, slug: string) {
    return (await this.listPublishedWines(brandId)).find((item) => item.slug === slug) ?? null
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
