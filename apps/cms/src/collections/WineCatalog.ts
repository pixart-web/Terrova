import type { CollectionConfig } from 'payload'
import { editorialAccess } from './access'

export const Producers: CollectionConfig = {
  slug: 'producers',
  access: editorialAccess,
  admin: { useAsTitle: 'name', group: 'Wine atlas' },
  fields: [
    { name: 'brands', type: 'relationship', relationTo: 'brands', hasMany: true, required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'country', type: 'relationship', relationTo: 'countries', required: true },
    { name: 'region', type: 'relationship', relationTo: 'regions' },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    { name: 'story', type: 'richText' },
  ],
}

/** Editorial wine identity. Pricing and bottle format belong to WineSKUs. */
export const Wines: CollectionConfig = {
  slug: 'wines',
  access: editorialAccess,
  admin: { useAsTitle: 'name', group: 'Wine catalogue' },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'producer', type: 'relationship', relationTo: 'producers', required: true },
    { name: 'country', type: 'relationship', relationTo: 'countries', required: true },
    { name: 'region', type: 'relationship', relationTo: 'regions', required: true },
    { name: 'grapes', type: 'relationship', relationTo: 'grapes', hasMany: true },
    { name: 'vintage', type: 'number', min: 1900, max: 2100 },
    {
      name: 'style',
      type: 'select',
      options: ['red', 'white', 'rosé', 'orange', 'sparkling', 'fortified'],
    },
    { name: 'story', type: 'richText' },
    { name: 'label', type: 'upload', relationTo: 'media' },
  ],
}

/** Sellable bottle/SKU. Deliberately separate from Wines. */
export const WineSKUs: CollectionConfig = {
  slug: 'wine-skus',
  labels: { singular: 'Wine SKU / Bottle', plural: 'Wine SKUs / Bottles' },
  access: editorialAccess,
  admin: { useAsTitle: 'sku', group: 'Wine catalogue' },
  fields: [
    { name: 'wine', type: 'relationship', relationTo: 'wines', required: true, index: true },
    { name: 'sku', type: 'text', required: true, unique: true, index: true },
    { name: 'bottleSizeMl', type: 'number', required: true, defaultValue: 750, min: 50 },
    {
      name: 'priceAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Minor currency unit, e.g. cents.' },
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'EUR',
      options: ['EUR', 'GBP', 'USD'],
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
    {
      name: 'externalProductId',
      type: 'text',
      admin: { description: 'Reserved for the future commerce provider.' },
    },
    {
      name: 'externalPriceId',
      type: 'text',
      admin: { description: 'Reserved for the future commerce provider.' },
    },
  ],
}
