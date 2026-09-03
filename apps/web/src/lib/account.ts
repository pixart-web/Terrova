import type {
  CustomerAddress,
  CustomerIdentity,
  CustomerOrder,
  CustomerSubscription,
  EntityID,
  TasteProfile,
} from '@terrova/types'

import { cmsRequest, type PayloadList } from './cms'

type Document = Record<string, unknown> & { id: EntityID }

function relation(value: unknown): Document | undefined {
  return value && typeof value === 'object' && 'id' in value ? (value as Document) : undefined
}

function relationID(value: unknown) {
  return relation(value)?.id ?? value
}

export interface CellarItem {
  id: EntityID
  wineId: EntityID
  wineName: string
  producerName?: string
  experiencedAt: string
  rating?: number
}

export interface AccountData {
  customer: CustomerIdentity
  subscriptions: CustomerSubscription[]
  orders: CustomerOrder[]
  addresses: CustomerAddress[]
  cellar: CellarItem[]
  tasteProfile: TasteProfile
  providerCustomerId?: string
}

async function list(path: string, token: string) {
  return (await cmsRequest<PayloadList<Document>>(path, { token, cache: 'no-store' })).docs
}

export async function loadAccountData(
  customer: CustomerIdentity,
  token: string,
): Promise<AccountData> {
  const [subscriptions, orders, orderItems, addresses, cellar, ratings, signals, providerCustomer] =
    await Promise.all([
      list('/api/subscriptions?depth=2&limit=100', token),
      list('/api/orders?depth=2&limit=100&sort=-createdAt', token),
      list('/api/order-items?depth=2&limit=200', token),
      list('/api/addresses?depth=0&limit=100', token),
      list('/api/cellar-entries?depth=3&limit=200&sort=-experiencedAt', token),
      list('/api/ratings?depth=1&limit=200', token),
      list('/api/taste-signals?depth=0&limit=100&sort=-score', token),
      cmsRequest<Document>(`/api/customers/${customer.id}?depth=0`, {
        service: true,
        cache: 'no-store',
      }),
    ])

  const mappedSubscriptions: CustomerSubscription[] = subscriptions.map((subscription) => {
    const plan = relation(subscription.plan)
    return {
      id: subscription.id,
      planCode: String(plan?.code ?? ''),
      planName: String(plan?.name ?? 'Terrova membership'),
      status: subscription.status as CustomerSubscription['status'],
      currentPeriodStart: subscription.currentPeriodStart as string | undefined,
      currentPeriodEnd: subscription.currentPeriodEnd as string | undefined,
      cancelAtPeriodEnd: Boolean(subscription.cancelAtPeriodEnd),
    }
  })

  const mappedOrders: CustomerOrder[] = orders.map((order) => ({
    id: order.id,
    code: String(order.code),
    status: order.status as CustomerOrder['status'],
    total: {
      amount: Number(order.totalAmount ?? 0),
      currency: (order.currency ?? 'EUR') as CustomerOrder['total']['currency'],
    },
    createdAt: String(order.createdAt),
    editionTitle: String(relation(order.edition)?.title ?? '') || undefined,
    items: orderItems
      .filter((item) => String(relationID(item.order)) === String(order.id))
      .map((item) => ({ description: String(item.description), quantity: Number(item.quantity) }))
      .map(({ description, quantity }) => ({ name: description, quantity })),
  }))

  const mappedAddresses: CustomerAddress[] = addresses.map((address) => ({
    id: address.id,
    label: String(address.label),
    recipientName: String(address.recipientName),
    line1: String(address.line1),
    line2: String(address.line2 ?? '') || undefined,
    city: String(address.city),
    postalCode: String(address.postalCode),
    countryCode: String(address.countryCode),
    isDefault: Boolean(address.isDefault),
  }))

  const mappedCellar: CellarItem[] = cellar.map((entry) => {
    const wine = relation(entry.wine)
    const rating = ratings.find((item) => String(relationID(item.wine)) === String(wine?.id))
    return {
      id: entry.id,
      wineId: wine?.id ?? '',
      wineName: String(wine?.name ?? 'Unknown wine'),
      producerName: String(relation(wine?.producer)?.name ?? '') || undefined,
      experiencedAt: String(entry.experiencedAt),
      rating: rating ? Number(rating.score) : undefined,
    }
  })

  return {
    customer,
    subscriptions: mappedSubscriptions,
    orders: mappedOrders,
    addresses: mappedAddresses,
    cellar: mappedCellar,
    tasteProfile: {
      observedRatings: ratings.length,
      observedWines: new Set(ratings.map((item) => String(relationID(item.wine)))).size,
      preferences: signals.map((signal) => ({
        category: signal.category as TasteProfile['preferences'][number]['category'],
        key: String(signal.key),
        label: String(signal.label),
        score: Number(signal.score),
        observations: Number(signal.observations),
      })),
      suggestedDirections: signals
        .filter((signal) => Number(signal.score) > 0)
        .slice(0, 3)
        .map((signal) => `Explore more ${String(signal.label)}`),
    },
    providerCustomerId: String(providerCustomer.externalCustomerId ?? '') || undefined,
  }
}
