import type { CollectionConfig } from 'payload'
import { editorialAccess } from './access'

export const Plans: CollectionConfig = {
  slug: 'plans',
  access: editorialAccess,
  admin: { useAsTitle: 'name', group: 'Membership' },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'cadence',
      type: 'select',
      required: true,
      options: ['monthly', 'bi_monthly', 'quarterly'],
    },
    { name: 'bottlesPerBox', type: 'number', required: true, min: 1 },
    { name: 'priceAmount', type: 'number', required: true, min: 0 },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'EUR',
      options: ['EUR', 'GBP', 'USD'],
    },
    {
      name: 'externalPriceId',
      type: 'text',
      admin: { description: 'Reserved for Stripe; unused in this release.' },
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}

export const Editions: CollectionConfig = {
  slug: 'editions',
  access: editorialAccess,
  admin: { useAsTitle: 'title', group: 'Editions' },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'releaseState',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['draft', 'preview', 'live', 'archived'],
    },
    { name: 'opensAt', type: 'date' },
    { name: 'closesAt', type: 'date' },
    { name: 'region', type: 'relationship', relationTo: 'regions' },
    { name: 'hero', type: 'upload', relationTo: 'media' },
    { name: 'narrative', type: 'richText' },
  ],
}

export const Boxes: CollectionConfig = {
  slug: 'boxes',
  access: editorialAccess,
  admin: { useAsTitle: 'name', group: 'Editions' },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'edition', type: 'relationship', relationTo: 'editions', required: true },
    { name: 'plan', type: 'relationship', relationTo: 'plans', required: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'wineSKUs',
      type: 'relationship',
      relationTo: 'wine-skus',
      hasMany: true,
      required: true,
      minRows: 1,
    },
    { name: 'packingNote', type: 'textarea' },
  ],
}
