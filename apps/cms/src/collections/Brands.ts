import type { CollectionConfig } from 'payload'
import { activeOrAdmin, adminOnly } from './access'

export const Brands: CollectionConfig = {
  slug: 'brands',
  access: { read: activeOrAdmin, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'name', group: 'Multi-brand' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'locale', type: 'text', required: true, defaultValue: 'en-GB' },
    {
      name: 'hostnames',
      type: 'array',
      fields: [{ name: 'hostname', type: 'text', required: true }],
    },
    { name: 'supportEmail', type: 'email', required: true, defaultValue: 'hello@terrova.net' },
    { name: 'active', type: 'checkbox', defaultValue: true, index: true },
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
