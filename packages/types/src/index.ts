export type EntityID = string | number
export type ISODate = string
export type Currency = 'EUR' | 'GBP' | 'USD'
export type PublicationStatus = 'draft' | 'scheduled' | 'live' | 'archived'

export interface BrandIdentity {
  id: EntityID
  slug: string
  name: string
  hostnames: string[]
  locale: string
  currency: Currency
}

export interface Money {
  amount: number
  currency: Currency
}

export interface MediaAsset {
  id: EntityID
  url: string
  alt: string
  width?: number
  height?: number
}

export interface ProducerSummary {
  id: EntityID
  slug: string
  name: string
  region?: string
  country: string
  introduction?: string
  portrait?: MediaAsset
}

export interface WineIdentity {
  id: EntityID
  brandId: EntityID
  slug: string
  name: string
  producerId: EntityID
  producerName?: string
  regionId: EntityID
  regionName?: string
  countryName?: string
  grapeIds: EntityID[]
  grapeNames?: string[]
  vintage?: number
  style?: WineStyle
  introduction?: string
  label?: MediaAsset
}

export type WineStyle = 'red' | 'white' | 'rosé' | 'orange' | 'sparkling' | 'fortified'

/** Sellable bottle/SKU. Kept separate from the editorial Wine entity. */
export interface WineSKU {
  id: EntityID
  wineId: EntityID
  sku: string
  bottleSizeMl: number
  price: Money
  active: boolean
  stockOnHand?: number
  stockReserved?: number
}

export type PlanCadence = 'monthly' | 'bi_monthly' | 'quarterly'

export interface SubscriptionPlan {
  id: EntityID
  brandId: EntityID
  code: string
  name: string
  positioning: string
  description?: string
  cadence: PlanCadence
  price: Money
  mostPopular?: boolean
  externalPriceId?: string
  active: boolean
}

export type SubscriptionStatus = 'pending' | 'active' | 'paused' | 'payment_issue' | 'cancelled'

export type OrderStatus =
  'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export interface EditionSummary {
  id: EntityID
  code: string
  slug: string
  title: string
  period: string
  introduction?: string
  hero?: MediaAsset
}

export interface BoxSummary {
  id: EntityID
  name: string
  edition: EditionSummary
  planCode: string
  wines: WineIdentity[]
}

export interface JournalEntry {
  id: EntityID
  slug: string
  title: string
  excerpt: string
  publishedAt: ISODate
  hero?: MediaAsset
  body?: unknown
}

export interface EditorialPageContent {
  id: EntityID
  slug: string
  title: string
  eyebrow?: string
  introduction?: string
  body?: unknown
  noIndex?: boolean
}

export interface CustomerIdentity {
  id: EntityID
  email: string
  name?: string
  brandId: EntityID
  emailVerified?: boolean
  externalCustomerId?: string
}

export interface CustomerAddress {
  id: EntityID
  label: string
  recipientName: string
  line1: string
  line2?: string
  city: string
  postalCode: string
  countryCode: string
  isDefault: boolean
}

export interface CustomerSubscription {
  id: EntityID
  planCode: string
  planName: string
  status: SubscriptionStatus
  currentPeriodStart?: ISODate
  currentPeriodEnd?: ISODate
  cancelAtPeriodEnd?: boolean
}

export interface CustomerOrder {
  id: EntityID
  code: string
  status: OrderStatus
  total: Money
  createdAt: ISODate
  editionTitle?: string
  items: Array<{ name: string; quantity: number }>
}

export type TasteSignalCategory = 'grape' | 'region' | 'country' | 'style'

export interface TasteSignalScore {
  category: TasteSignalCategory
  key: string
  label: string
  score: number
  observations: number
}

export interface TasteProfile {
  observedRatings: number
  observedWines: number
  preferences: TasteSignalScore[]
  suggestedDirections: string[]
}

export interface GiftIntent {
  id: EntityID
  code: string
  status: 'draft' | 'checkout_pending' | 'purchased' | 'notified' | 'redeemed' | 'cancelled'
  recipientName: string
  recipientEmail: string
  purchaserEmail: string
  message?: string
  startsAt?: ISODate
  planCode: string
}

export interface SiteSettings {
  siteName: string
  siteUrl: string
  defaultTitle: string
  defaultDescription: string
  ageGateEnabled: boolean
  minimumAge: number
  shippingCountries: string[]
  supportEmail: string
}
