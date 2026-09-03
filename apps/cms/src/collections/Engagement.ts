import type { Access, CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { adminOnly, isAdminOrService, ownCustomerRelation } from './access'

const customerCreate: Access = ({ req }) =>
  isAdminOrService(req) || req.user?.collection === 'customers'

const enforceCustomer: CollectionBeforeChangeHook = ({ data, req }) =>
  req.user?.collection === 'customers' ? { ...data, customer: req.user.id } : data

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
  hooks: { beforeChange: [enforceCustomer] },
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
