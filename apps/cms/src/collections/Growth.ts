import type { CollectionConfig } from 'payload'

import { adminOnly, ownCustomerRelation } from './access'

export const Gifts: CollectionConfig = {
  slug: 'gifts',
  admin: { useAsTitle: 'code', group: 'Commerce' },
  access: { read: ownCustomerRelation, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'customer', type: 'relationship', relationTo: 'customers', index: true },
    { name: 'plan', type: 'relationship', relationTo: 'plans', required: true },
    { name: 'purchaserEmail', type: 'email', required: true, index: true },
    { name: 'recipientName', type: 'text', required: true },
    { name: 'recipientEmail', type: 'email', required: true },
    { name: 'message', type: 'textarea', maxLength: 1000 },
    { name: 'startsAt', type: 'date' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: ['draft', 'checkout_pending', 'purchased', 'notified', 'redeemed', 'cancelled'],
    },
    { name: 'providerCheckoutId', type: 'text', unique: true, index: true },
    { name: 'redemptionTokenHash', type: 'text', index: true },
    { name: 'redeemedAt', type: 'date' },
  ],
}

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  admin: { useAsTitle: 'name', group: 'Commerce' },
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'providerPromotionCodeId', type: 'text', unique: true },
    { name: 'active', type: 'checkbox', defaultValue: true, index: true },
    { name: 'startsAt', type: 'date' },
    { name: 'endsAt', type: 'date' },
    { name: 'usageLimit', type: 'number', min: 1 },
  ],
}
