import type { CollectionConfig } from 'payload'

import { adminOnly, publicRead } from './access'

export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',
  admin: { useAsTitle: 'siteName', group: 'Multi-brand' },
  access: { read: publicRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'siteName', type: 'text', required: true },
    { name: 'siteUrl', type: 'text', required: true },
    { name: 'defaultTitle', type: 'text', required: true },
    { name: 'defaultDescription', type: 'textarea', required: true, maxLength: 170 },
    { name: 'supportEmail', type: 'email', required: true },
    { name: 'ageGateEnabled', type: 'checkbox', defaultValue: true },
    { name: 'minimumAge', type: 'number', required: true, defaultValue: 18, min: 18 },
    {
      name: 'shippingCountries',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'countryCode', type: 'text', required: true, minLength: 2, maxLength: 2 },
        { name: 'label', type: 'text', required: true },
      ],
    },
    { name: 'termsReviewedAt', type: 'date' },
    { name: 'privacyReviewedAt', type: 'date' },
  ],
}

export const WebhookEvents: CollectionConfig = {
  slug: 'webhook-events',
  admin: { useAsTitle: 'providerEventId', group: 'System' },
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: () => false },
  fields: [
    { name: 'provider', type: 'select', required: true, options: ['stripe'] },
    { name: 'providerEventId', type: 'text', required: true, unique: true, index: true },
    { name: 'eventType', type: 'text', required: true, index: true },
    { name: 'livemode', type: 'checkbox', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'processing',
      index: true,
      options: ['processing', 'processed', 'failed', 'ignored'],
    },
    { name: 'receivedAt', type: 'date', required: true },
    { name: 'processedAt', type: 'date' },
    { name: 'attempts', type: 'number', required: true, defaultValue: 1, min: 1 },
    { name: 'errorCode', type: 'text' },
  ],
}
