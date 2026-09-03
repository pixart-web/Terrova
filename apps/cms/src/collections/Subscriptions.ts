import type { CollectionConfig } from 'payload'
import { activeOrAdmin, adminOnly, liveOrAdmin, readyOrAdmin } from './access'

export const Plans: CollectionConfig = {
  slug: 'plans',
  access: { read: activeOrAdmin, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'name', group: 'Membership' },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea' },
    { name: 'positioning', type: 'text', required: true },
    { name: 'mostPopular', type: 'checkbox', defaultValue: false },
    {
      name: 'cadence',
      type: 'select',
      required: true,
      options: ['monthly', 'bi_monthly', 'quarterly'],
    },
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
      admin: { description: 'Stripe Price ID. Configure per environment; never invent live IDs.' },
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}

export const Editions: CollectionConfig = {
  slug: 'editions',
  access: { read: liveOrAdmin, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'title', group: 'Editions' },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: ['draft', 'scheduled', 'live', 'archived'],
    },
    {
      name: 'period',
      type: 'text',
      required: true,
      admin: { description: 'Editorial period label.' },
    },
    { name: 'periodStart', type: 'date', required: true, index: true },
    { name: 'periodEnd', type: 'date', required: true },
    { name: 'publishAt', type: 'date', index: true },
    { name: 'region', type: 'relationship', relationTo: 'regions' },
    { name: 'hero', type: 'upload', relationTo: 'media' },
    { name: 'narrative', type: 'richText' },
    {
      name: 'eligiblePlans',
      type: 'relationship',
      relationTo: 'plans',
      hasMany: true,
      required: true,
      minRows: 1,
    },
    {
      name: 'wineSKUs',
      type: 'relationship',
      relationTo: 'wine-skus',
      hasMany: true,
      required: true,
      minRows: 1,
    },
    {
      name: 'storyChapters',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText', required: true },
        { name: 'media', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const Boxes: CollectionConfig = {
  slug: 'boxes',
  access: { read: readyOrAdmin, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'name', group: 'Editions' },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'edition', type: 'relationship', relationTo: 'editions', required: true },
    { name: 'plan', type: 'relationship', relationTo: 'plans', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: ['draft', 'ready', 'packing', 'closed', 'archived'],
    },
    {
      name: 'wineSKUs',
      type: 'relationship',
      relationTo: 'wine-skus',
      hasMany: true,
      required: true,
      minRows: 1,
    },
    { name: 'packingNote', type: 'textarea' },
    { name: 'packingDeadline', type: 'date' },
    { name: 'expectedShipAt', type: 'date' },
  ],
}
