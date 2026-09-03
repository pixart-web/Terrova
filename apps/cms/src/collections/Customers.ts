import { APIError, type CollectionConfig } from 'payload'

import { adminOnly, isAdminOrService, ownCustomerRecord, ownCustomerRelation } from './access'

function relationshipID(value: unknown): string | number | undefined {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return /^\d+$/.test(value) ? Number(value) : value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'number') return id
    if (typeof id === 'string') return /^\d+$/.test(id) ? Number(id) : id
  }
  return undefined
}

async function authenticatedCustomerBrand(req: Parameters<typeof isAdminOrService>[0]) {
  if (req.user?.collection !== 'customers') return undefined
  const embedded = relationshipID((req.user as unknown as { brand?: unknown }).brand)
  if (embedded) return embedded
  const customer = await req.payload.findByID({
    collection: 'customers',
    id: req.user.id,
    depth: 0,
    req,
    overrideAccess: true,
  })
  return relationshipID(customer.brand)
}

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: {
    verify: {
      generateEmailSubject: () => 'Confirm your Terrova cellar',
      generateEmailHTML: ({ token }) => {
        const url = new URL(
          `/account/verify/${encodeURIComponent(token)}`,
          process.env.WEB_URL ?? 'http://localhost:3000',
        )
        return `<p>Welcome to Terrova.</p><p><a href="${url.toString()}">Confirm your email and open your cellar</a></p><p>If you did not create this account, you can ignore this message.</p>`
      },
    },
    forgotPassword: {
      generateEmailSubject: () => 'Reset your Terrova password',
      generateEmailHTML: (args) => {
        const token = args?.token ?? ''
        const url = new URL(
          `/account/reset-password?token=${encodeURIComponent(token)}`,
          process.env.WEB_URL ?? 'http://localhost:3000',
        )
        return `<p>A password reset was requested for your Terrova cellar.</p><p><a href="${url.toString()}">Choose a new password</a></p><p>If this was not you, no action is needed.</p>`
      },
    },
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 2 * 60 * 60,
  },
  admin: { useAsTitle: 'email', group: 'Customers' },
  access: {
    read: ownCustomerRecord,
    create: adminOnly,
    update: ownCustomerRecord,
    delete: adminOnly,
    unlock: adminOnly,
  },
  fields: [
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      index: true,
      access: { update: ({ req }) => isAdminOrService(req) },
    },
    { name: 'name', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      index: true,
      options: ['pending_verification', 'active', 'disabled'],
      access: { update: ({ req }) => isAdminOrService(req) },
    },
    {
      name: 'externalCustomerId',
      type: 'text',
      unique: true,
      index: true,
      access: {
        read: ({ req }) => isAdminOrService(req),
        update: ({ req }) => isAdminOrService(req),
      },
      admin: { description: 'Stripe Customer reference; server-side only.' },
    },
    { name: 'marketingConsent', type: 'checkbox', defaultValue: false },
    { name: 'termsAcceptedAt', type: 'date', required: true },
  ],
}

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  admin: { useAsTitle: 'label', group: 'Customers' },
  access: {
    read: ownCustomerRelation,
    create: ({ req }) => isAdminOrService(req) || req.user?.collection === 'customers',
    update: ownCustomerRelation,
    delete: ownCustomerRelation,
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (req.user?.collection === 'customers') {
          const brand = await authenticatedCustomerBrand(req)
          if (!brand) {
            throw new APIError('Customer brand could not be resolved', 403, null, true)
          }
          return { ...data, customer: req.user.id, brand }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
      access: {
        create: ({ req }) => isAdminOrService(req),
        update: ({ req }) => isAdminOrService(req),
      },
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      index: true,
      access: {
        create: ({ req }) => isAdminOrService(req),
        update: ({ req }) => isAdminOrService(req),
      },
    },
    { name: 'label', type: 'text', required: true, defaultValue: 'Home' },
    { name: 'recipientName', type: 'text', required: true },
    { name: 'line1', type: 'text', required: true },
    { name: 'line2', type: 'text' },
    { name: 'city', type: 'text', required: true },
    { name: 'postalCode', type: 'text', required: true },
    { name: 'countryCode', type: 'text', required: true, minLength: 2, maxLength: 2 },
    { name: 'isDefault', type: 'checkbox', defaultValue: false },
  ],
}
