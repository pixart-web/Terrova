export type EntityID = string
export type ISODate = string

export interface BrandIdentity {
  id: EntityID
  slug: string
  name: string
  hostnames: string[]
  currency: 'EUR' | 'GBP' | 'USD'
}

export interface Money {
  amount: number
  currency: BrandIdentity['currency']
}

export interface WineIdentity {
  id: EntityID
  brandId: EntityID
  name: string
  producerId: EntityID
  regionId: EntityID
  grapeIds: EntityID[]
  vintage?: number
}

/** Sellable bottle/SKU. Kept separate from the editorial Wine entity. */
export interface WineSKU {
  id: EntityID
  wineId: EntityID
  sku: string
  bottleSizeMl: number
  price: Money
  active: boolean
}

export interface SubscriptionPlan {
  id: EntityID
  brandId: EntityID
  code: string
  cadence: 'monthly' | 'bi_monthly' | 'quarterly'
  price: Money
  bottlesPerBox: number
}
