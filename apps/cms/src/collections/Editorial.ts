import type { CollectionConfig } from 'payload'

import { adminOnly, liveOrAdmin } from './access'

const publicationFields: CollectionConfig['fields'] = [
  {
    name: 'status',
    type: 'select',
    required: true,
    defaultValue: 'draft',
    index: true,
    options: ['draft', 'scheduled', 'live', 'archived'],
  },
  { name: 'publishAt', type: 'date', index: true },
]

const seoFields: CollectionConfig['fields'] = [
  {
    name: 'seo',
    type: 'group',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea', maxLength: 170 },
      { name: 'image', type: 'upload', relationTo: 'media' },
      { name: 'noIndex', type: 'checkbox', defaultValue: false },
    ],
  },
]

export const JournalPosts: CollectionConfig = {
  slug: 'journal-posts',
  admin: { useAsTitle: 'title', group: 'Editorial' },
  access: { read: liveOrAdmin, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 320 },
    { name: 'body', type: 'richText', required: true },
    { name: 'hero', type: 'upload', relationTo: 'media' },
    { name: 'authorName', type: 'text' },
    { name: 'publishedAt', type: 'date', index: true },
    ...publicationFields,
    ...seoFields,
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', group: 'Editorial' },
  access: { read: liveOrAdmin, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'eyebrow', type: 'text' },
    { name: 'introduction', type: 'textarea' },
    { name: 'body', type: 'richText', required: true },
    ...publicationFields,
    ...seoFields,
  ],
}
