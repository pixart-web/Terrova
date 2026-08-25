import type { CollectionConfig } from 'payload'
import { editorialAccess } from './access'

export const Brands: CollectionConfig = {
  slug: 'brands',
  access: editorialAccess,
  admin: { useAsTitle: 'name', group: 'Multi-brand' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'hostnames',
      type: 'array',
      fields: [{ name: 'hostname', type: 'text', required: true }],
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'EUR',
      options: ['EUR', 'GBP', 'USD'],
    },
    {
      name: 'theme',
      type: 'group',
      fields: [
        { name: 'ink', type: 'text', defaultValue: '#171714', required: true },
        { name: 'cream', type: 'text', defaultValue: '#F3EFE4', required: true },
        { name: 'accent', type: 'text', defaultValue: '#B65F43', required: true },
        { name: 'secondary', type: 'text', defaultValue: '#35483A', required: true },
      ],
    },
  ],
}
