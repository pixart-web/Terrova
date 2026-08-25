import type { CollectionConfig } from 'payload'
import { editorialAccess } from './access'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 900, height: 1200, position: 'centre' },
      { name: 'wide', width: 1800, height: 1200, position: 'centre' },
    ],
    adminThumbnail: 'card',
  },
  access: editorialAccess,
  admin: { group: 'System' },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'textarea' },
    { name: 'credit', type: 'text' },
  ],
}
