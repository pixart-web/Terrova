import type { CollectionConfig } from 'payload'
import { editorialAccess } from './access'

export const Countries: CollectionConfig = {
  slug: 'countries',
  access: editorialAccess,
  admin: { useAsTitle: 'name', group: 'Wine atlas' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true, maxLength: 2 },
  ],
}

export const Regions: CollectionConfig = {
  slug: 'regions',
  access: editorialAccess,
  admin: { useAsTitle: 'name', group: 'Wine atlas' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'country', type: 'relationship', relationTo: 'countries', required: true },
    { name: 'story', type: 'richText' },
    { name: 'hero', type: 'upload', relationTo: 'media' },
  ],
}

export const Grapes: CollectionConfig = {
  slug: 'grapes',
  access: editorialAccess,
  admin: { useAsTitle: 'name', group: 'Wine atlas' },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'aliases', type: 'array', fields: [{ name: 'name', type: 'text', required: true }] },
    { name: 'colour', type: 'select', options: ['red', 'white', 'pink', 'grey'] },
  ],
}
