import type { Access, CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { adminOnly, isAdminOrService, ownCustomerRelation } from './access'

const customerCreate: Access = ({ req }) =>
  isAdminOrService(req) || req.user?.collection === 'customers'

function relationshipID(value: unknown): string | number | undefined {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return undefined
}

const enforceRatingOwnership: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  if (req.user?.collection !== 'customers') return data
  const customer = await req.payload.findByID({
    collection: 'customers',
    id: req.user.id,
    depth: 0,
    req,
    overrideAccess: true,
  })
  const brand = relationshipID(customer.brand)
  const wineID = relationshipID(data.wine ?? originalDoc?.wine)
  const cellarEntryID = relationshipID(data.cellarEntry ?? originalDoc?.cellarEntry)
  if (!brand || !wineID) throw new Error('Rating customer brand and wine are required')

  const wine = await req.payload.findByID({
    collection: 'wines',
    id: wineID,
    depth: 0,
    req,
    overrideAccess: true,
  })
  if (String(relationshipID(wine.brand)) !== String(brand)) {
    throw new Error('Wine does not belong to the customer brand')
  }

  if (cellarEntryID) {
    const cellarEntry = await req.payload.findByID({
      collection: 'cellar-entries',
      id: cellarEntryID,
      depth: 0,
      req,
      overrideAccess: true,
    })
    if (
      String(relationshipID(cellarEntry.customer)) !== String(req.user.id) ||
      String(relationshipID(cellarEntry.brand)) !== String(brand) ||
      String(relationshipID(cellarEntry.wine)) !== String(wineID)
    ) {
      throw new Error('Cellar entry does not belong to this customer, brand and wine')
    }
  }

  return { ...data, customer: req.user.id, brand, wine: wineID, cellarEntry: cellarEntryID }
}

export const CellarEntries: CollectionConfig = {
  slug: 'cellar-entries',
  admin: { useAsTitle: 'id', group: 'Taste' },
  access: { read: ownCustomerRelation, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
    },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'wine', type: 'relationship', relationTo: 'wines', required: true, index: true },
    { name: 'wineSKU', type: 'relationship', relationTo: 'wine-skus' },
    { name: 'order', type: 'relationship', relationTo: 'orders', required: true, index: true },
    { name: 'experiencedAt', type: 'date', required: true, index: true },
  ],
}

export const Ratings: CollectionConfig = {
  slug: 'ratings',
  admin: { useAsTitle: 'id', group: 'Taste' },
  access: {
    read: ownCustomerRelation,
    create: customerCreate,
    update: ownCustomerRelation,
    delete: ownCustomerRelation,
  },
  hooks: { beforeChange: [enforceRatingOwnership] },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
      access: {
        create: ({ req }) => isAdminOrService(req),
        update: ({ req }) => isAdminOrService(req),
      },
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      index: true,
      access: {
        create: ({ req }) => isAdminOrService(req),
        update: ({ req }) => isAdminOrService(req),
      },
    },
    { name: 'wine', type: 'relationship', relationTo: 'wines', required: true, index: true },
    { name: 'cellarEntry', type: 'relationship', relationTo: 'cellar-entries', index: true },
    { name: 'score', type: 'number', required: true, min: 1, max: 5 },
    { name: 'wouldDrinkAgain', type: 'checkbox' },
    { name: 'note', type: 'textarea', maxLength: 1000 },
  ],
}

export const TasteSignals: CollectionConfig = {
  slug: 'taste-signals',
  admin: { useAsTitle: 'label', group: 'Taste' },
  access: { read: ownCustomerRelation, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
    },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: ['grape', 'region', 'country', 'style'],
    },
    { name: 'key', type: 'text', required: true, index: true },
    { name: 'label', type: 'text', required: true },
    { name: 'score', type: 'number', required: true, min: -5, max: 5 },
    { name: 'observations', type: 'number', required: true, min: 1 },
    { name: 'calculatedAt', type: 'date', required: true },
  ],
}
