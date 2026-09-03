import { cookies } from 'next/headers'

import type { CustomerIdentity, EntityID } from '@terrova/types'

import { cmsRequest } from '../cms'

export const SESSION_COOKIE = 'terrova-session'
export const PENDING_CHECKOUT_COOKIE = 'terrova-pending-checkout'

interface PayloadCustomer extends Record<string, unknown> {
  id: EntityID
  email: string
  name?: string
  brand: EntityID | { id: EntityID }
  _verified?: boolean
  externalCustomerId?: string
}

function customerIdentity(user: PayloadCustomer): CustomerIdentity {
  const brandId =
    user.brand && typeof user.brand === 'object' && 'id' in user.brand ? user.brand.id : user.brand
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    brandId,
    emailVerified: user._verified,
    externalCustomerId: user.externalCustomerId,
  }
}

export async function sessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value
}

export async function pendingCheckoutPath(): Promise<string | undefined> {
  const value = (await cookies()).get(PENDING_CHECKOUT_COOKIE)?.value
  if (!value) return undefined
  try {
    return decodeURIComponent(value)
  } catch {
    return undefined
  }
}

export async function getCurrentCustomer(): Promise<CustomerIdentity | null> {
  const token = await sessionToken()
  if (!token) return null
  try {
    const response = await cmsRequest<{ user: PayloadCustomer }>('/api/customers/me', { token })
    return response.user ? customerIdentity(response.user) : null
  } catch {
    return null
  }
}

export function sessionCookieOptions(maxAge = 2 * 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
    priority: 'high' as const,
  }
}

export function pendingCheckoutCookieOptions() {
  return sessionCookieOptions(60 * 60)
}
