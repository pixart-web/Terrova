import type { CollectionConfig } from 'payload'
import { adminOnly, liveOrAdmin, publicRead } from './access'

export const Countries: CollectionConfig = {
  slug: 'countries',
  access: { read: publicRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'name', group: 'Wine atlas' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true, maxLength: 2 },
  ],
}

export const Regions: CollectionConfig = {
  slug: 'regions',
  access: { read: liveOrAdmin, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'name', group: 'Wine atlas' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: ['draft', 'scheduled', 'live', 'archived'],
    },
    { name: 'country', type: 'relationship', relationTo: 'countries', required: true },
    { name: 'story', type: 'richText' },
    { name: 'hero', type: 'upload', relationTo: 'media' },
  ],
}

export const Grapes: CollectionConfig = {
  slug: 'grapes',
  access: { read: publicRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'name', group: 'Wine atlas' },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'aliases', type: 'array', fields: [{ name: 'name', type: 'text', required: true }] },
    { name: 'colour', type: 'select', options: ['red', 'white', 'pink', 'grey'] },
  ],
}
