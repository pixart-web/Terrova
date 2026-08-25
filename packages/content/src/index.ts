import type { BrandIdentity, EntityID } from '@terrova/types'

export interface BrandContext {
  brand: BrandIdentity
  resolvedFrom: 'hostname' | 'default'
}

export interface ContentRepository {
  resolveBrand(hostname?: string): Promise<BrandContext>
  listPublishedBoxes(brandId: EntityID): Promise<unknown[]>
  listPublishedJournalEntries(brandId: EntityID): Promise<unknown[]>
}
