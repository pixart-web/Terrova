import type { CollectionConfig } from 'payload'

import { adminOnly, ownCustomerRelation } from './access'

const orderTransitions: Record<string, readonly string[]> = {
  pending: ['paid', 'cancelled'],
  paid: ['preparing', 'cancelled', 'refunded'],
  preparing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'refunded'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

export function canTransitionOrder(from: string, to: string) {
  return from === to || Boolean(orderTransitions[from]?.includes(to))
}

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: { useAsTitle: 'code', group: 'Commerce' },
  access: { read: ownCustomerRelation, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
    },
    { name: 'plan', type: 'relationship', relationTo: 'plans', required: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: ['pending', 'active', 'paused', 'payment_issue', 'cancelled'],
    },
    { name: 'currentPeriodStart', type: 'date' },
    { name: 'currentPeriodEnd', type: 'date', index: true },
    { name: 'cancelAtPeriodEnd', type: 'checkbox', defaultValue: false },
    { name: 'providerSubscriptionId', type: 'text', unique: true, index: true },
    { name: 'providerCustomerId', type: 'text', index: true },
    { name: 'lastProviderEventAt', type: 'date' },
  ],
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: { useAsTitle: 'code', group: 'Commerce' },
  access: { read: ownCustomerRelation, create: adminOnly, update: adminOnly, delete: adminOnly },
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        if (operation !== 'update' || !data.status || !originalDoc?.status) return data
        if (!canTransitionOrder(String(originalDoc.status), String(data.status))) {
          throw new Error(`Invalid order transition: ${originalDoc.status} → ${data.status}`)
        }
        if (data.status === 'preparing' && !(data.box ?? originalDoc.box)) {
          throw new Error('A box must be assigned before an order enters preparation')
        }
        if (
          data.status === 'shipped' &&
          !(data.trackingReference ?? originalDoc.trackingReference)
        ) {
          throw new Error('A tracking reference is required before an order is marked shipped')
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, previousDoc, req }) => {
        if (operation !== 'update' || doc.status === previousDoc?.status) return doc
        const orderID = doc.id

        if (doc.status === 'preparing' && doc.box) {
          const existing = await req.payload.find({
            collection: 'order-items',
            where: { order: { equals: orderID } },
            limit: 1,
            depth: 0,
            req,
          })
          if (existing.totalDocs === 0) {
            const boxID = relationshipID(doc.box)
            if (boxID) {
              const box = await req.payload.findByID({
                collection: 'boxes',
                id: boxID,
                depth: 0,
                req,
              })
              for (const [index, skuValue] of box.wineSKUs.entries()) {
                const skuID = relationshipID(skuValue)
                if (!skuID) continue
                const sku = await req.payload.findByID({
                  collection: 'wine-skus',
                  id: skuID,
                  depth: 1,
                  req,
                })
                const wineName = typeof sku.wine === 'object' ? sku.wine.name : sku.sku
                await req.payload.create({
                  collection: 'order-items',
                  req,
                  data: {
                    order: orderID,
                    customer: doc.customer,
                    brand: doc.brand,
                    wineSKU: skuID,
                    description: wineName,
                    quantity: 1,
                    unitAmount: sku.priceAmount,
                    currency: sku.currency,
                  },
                })
                await req.payload.create({
                  collection: 'inventory-movements',
                  req,
                  data: {
                    reference: `ALLOC-${orderID}-${skuID}-${index}`,
                    brand: doc.brand,
                    sku: skuID,
                    order: orderID,
                    reason: 'allocation',
                    quantityDelta: 0,
                    reservedDelta: 1,
                    balanceAfter: sku.stockOnHand,
                    reservedBalanceAfter: sku.stockReserved,
                  },
                })
              }
            }
          }
        }

        if (doc.status === 'shipped') {
          const items = await req.payload.find({
            collection: 'order-items',
            where: { order: { equals: orderID } },
            limit: 100,
            depth: 0,
            req,
          })
          for (const [index, item] of items.docs.entries()) {
            const skuID = relationshipID(item.wineSKU)
            if (!skuID) continue
            const sku = await req.payload.findByID({
              collection: 'wine-skus',
              id: skuID,
              depth: 0,
              req,
            })
            await req.payload.create({
              collection: 'inventory-movements',
              req,
              data: {
                reference: `SHIP-${orderID}-${skuID}-${index}`,
                brand: doc.brand,
                sku: skuID,
                order: orderID,
                reason: 'fulfilment',
                quantityDelta: -item.quantity,
                reservedDelta: -item.quantity,
                balanceAfter: sku.stockOnHand,
                reservedBalanceAfter: sku.stockReserved,
              },
            })
          }
        }

        if (doc.status === 'delivered') {
          const items = await req.payload.find({
            collection: 'order-items',
            where: { order: { equals: orderID } },
            limit: 100,
            depth: 0,
            req,
          })
          for (const item of items.docs) {
            const skuID = relationshipID(item.wineSKU)
            if (!skuID) continue
            const duplicate = await req.payload.find({
              collection: 'cellar-entries',
              where: { and: [{ order: { equals: orderID } }, { wineSKU: { equals: skuID } }] },
              limit: 1,
              depth: 0,
              req,
            })
            if (duplicate.totalDocs > 0) continue
            const sku = await req.payload.findByID({
              collection: 'wine-skus',
              id: skuID,
              depth: 0,
              req,
            })
            await req.payload.create({
              collection: 'cellar-entries',
              req,
              data: {
                customer: doc.customer,
                brand: doc.brand,
                wine: sku.wine,
                wineSKU: skuID,
                order: orderID,
                experiencedAt: new Date().toISOString(),
              },
            })
          }
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
    },
    { name: 'subscription', type: 'relationship', relationTo: 'subscriptions', index: true },
    { name: 'edition', type: 'relationship', relationTo: 'editions', index: true },
    { name: 'box', type: 'relationship', relationTo: 'boxes' },
    { name: 'shippingAddress', type: 'relationship', relationTo: 'addresses' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: ['pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    },
    { name: 'totalAmount', type: 'number', required: true, min: 0 },
    { name: 'currency', type: 'select', required: true, options: ['EUR', 'GBP', 'USD'] },
    { name: 'providerCheckoutId', type: 'text', unique: true, index: true },
    { name: 'providerInvoiceId', type: 'text', unique: true, index: true },
    { name: 'paidAt', type: 'date' },
    { name: 'shippedAt', type: 'date' },
    { name: 'trackingReference', type: 'text' },
    { name: 'operatorNote', type: 'textarea' },
  ],
}

export const OrderItems: CollectionConfig = {
  slug: 'order-items',
  admin: { useAsTitle: 'description', group: 'Commerce' },
  access: { read: ownCustomerRelation, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'order', type: 'relationship', relationTo: 'orders', required: true, index: true },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
    },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'wineSKU', type: 'relationship', relationTo: 'wine-skus', index: true },
    { name: 'description', type: 'text', required: true },
    { name: 'quantity', type: 'number', required: true, min: 1 },
    { name: 'unitAmount', type: 'number', required: true, min: 0 },
    { name: 'currency', type: 'select', required: true, options: ['EUR', 'GBP', 'USD'] },
  ],
}

function relationshipID(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'number') return id
  }
  return undefined
}

export const InventoryMovements: CollectionConfig = {
  slug: 'inventory-movements',
  admin: { useAsTitle: 'reference', group: 'Operations' },
  access: { read: adminOnly, create: adminOnly, update: () => false, delete: () => false },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const skuID = relationshipID(data.sku)
        if (!skuID) throw new Error('Inventory movement requires a WineSKU')
        const sku = await req.payload.findByID({
          collection: 'wine-skus',
          id: skuID,
          depth: 0,
          req,
        })
        const next = Number(sku.stockOnHand ?? 0) + Number(data.quantityDelta ?? 0)
        const nextReserved = Number(sku.stockReserved ?? 0) + Number(data.reservedDelta ?? 0)
        if (next < nextReserved || next < 0 || nextReserved < 0) {
          throw new Error('Inventory movement would make sellable stock negative')
        }
        return { ...data, brand: sku.brand, balanceAfter: next, reservedBalanceAfter: nextReserved }
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        const skuID = relationshipID(doc.sku)
        if (skuID) {
          await req.payload.update({
            collection: 'wine-skus',
            id: skuID,
            data: {
              stockOnHand: Number(doc.balanceAfter),
              stockReserved: Number(doc.reservedBalanceAfter),
            },
            req,
          })
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, index: true },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, index: true },
    { name: 'sku', type: 'relationship', relationTo: 'wine-skus', required: true, index: true },
    { name: 'order', type: 'relationship', relationTo: 'orders', index: true },
    {
      name: 'reason',
      type: 'select',
      required: true,
      options: ['receipt', 'allocation', 'release', 'fulfilment', 'adjustment', 'damage', 'return'],
    },
    { name: 'quantityDelta', type: 'number', required: true },
    { name: 'reservedDelta', type: 'number', required: true, defaultValue: 0 },
    { name: 'balanceAfter', type: 'number', required: true, min: 0 },
    { name: 'reservedBalanceAfter', type: 'number', required: true, min: 0 },
    { name: 'note', type: 'textarea' },
  ],
}
