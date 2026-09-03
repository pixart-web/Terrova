import { NextResponse } from 'next/server'

import { CommerceNotConfiguredError } from '@terrova/commerce'
import type { EntityID } from '@terrova/types'

import {
  getCurrentCustomer,
  PENDING_CHECKOUT_COOKIE,
  pendingCheckoutCookieOptions,
} from '@/lib/auth/session'
import { cmsRequest, type PayloadList } from '@/lib/cms'
import { commerceGateway } from '@/lib/commerce/gateway'
import { contentRepository, requestBrand } from '@/lib/content'
import { assertSameOrigin, cleanText, requestData } from '@/lib/security'
import { analyticsConsent, captureEvent } from '@/lib/services/analytics'
import { log } from '@/lib/services/logger'

type Document = Record<string, unknown> & { id: EntityID }

async function promotionReference(code: string, brandId: EntityID) {
  if (!code) return undefined
  const response = await cmsRequest<PayloadList<Document>>(
    `/api/promotions?depth=0&limit=1&where[code][equals]=${encodeURIComponent(code)}&where[brand][equals]=${encodeURIComponent(String(brandId))}`,
    { service: true, cache: 'no-store' },
  )
  const promotion = response.docs[0]
  if (!promotion || promotion.active === false) return undefined
  const now = Date.now()
  if (promotion.startsAt && new Date(String(promotion.startsAt)).getTime() > now) return undefined
  if (promotion.endsAt && new Date(String(promotion.endsAt)).getTime() < now) return undefined
  return String(promotion.providerPromotionCodeId ?? '') || undefined
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const data = await requestData(request)
    const planCode = cleanText(data.plan, 40).toLowerCase()
    if (!/^[a-z0-9-]+$/.test(planCode)) throw new Error('Invalid plan code')
    const promo = cleanText(data.promo, 80)
    const [{ brand }, customer] = await Promise.all([requestBrand(), getCurrentCustomer()])
    if (!customer) {
      const resume = new URLSearchParams({ plan: planCode, resume: '1' })
      if (promo) resume.set('promo', promo)
      const account = new URL('/account', request.url)
      account.searchParams.set('checkout', 'required')
      account.searchParams.set('returnTo', `/boxes?${resume.toString()}`)
      const response = NextResponse.redirect(account, 303)
      response.cookies.set(
        PENDING_CHECKOUT_COOKIE,
        encodeURIComponent(`/boxes?${resume.toString()}`),
        pendingCheckoutCookieOptions(),
      )
      return response
    }
    if (String(customer.brandId) !== String(brand.id)) {
      throw new Error('Customer and checkout brand do not match')
    }
    const plan = await contentRepository.getPlan(brand.id, planCode)
    if (!plan?.externalPriceId) throw new CommerceNotConfiguredError()

    const gateway = commerceGateway()
    const customerRecord = await cmsRequest<Document>(`/api/customers/${customer.id}?depth=0`, {
      service: true,
      cache: 'no-store',
    })
    let providerCustomerId = String(customerRecord?.externalCustomerId ?? '') || undefined
    if (!providerCustomerId) {
      const provider = await gateway.createCustomer({
        email: customer.email,
        name: customer.name,
        metadata: { customerId: String(customer.id), brandId: String(brand.id) },
      })
      providerCustomerId = provider.id
      await cmsRequest(`/api/customers/${customer.id}`, {
        service: true,
        method: 'PATCH',
        body: JSON.stringify({ externalCustomerId: provider.id }),
      })
    }

    const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
    const session = await gateway.createCheckout({
      brandId: brand.id,
      customerId: customer.id,
      customerEmail: customer.email,
      providerCustomerId,
      lines: [
        {
          referenceId: plan.id,
          providerPriceId: plan.externalPriceId,
          kind: 'subscription',
          quantity: 1,
        },
      ],
      successUrl: new URL('/checkout/success?session_id={CHECKOUT_SESSION_ID}', siteURL).toString(),
      cancelUrl: new URL(
        `/checkout/cancelled?plan=${encodeURIComponent(plan.code)}`,
        siteURL,
      ).toString(),
      promotionCode: await promotionReference(promo, brand.id),
      metadata: { planCode: plan.code, brandSlug: brand.slug },
    })
    if (analyticsConsent(request)) {
      await captureEvent('checkout_started', { brand: brand.slug, plan: plan.code })
    }
    return NextResponse.redirect(session.redirectUrl, 303)
  } catch (error) {
    log('error', 'checkout.failed', { errorType: error instanceof Error ? error.name : 'unknown' })
    const code = error instanceof CommerceNotConfiguredError ? 'not-configured' : 'unavailable'
    return NextResponse.redirect(new URL(`/boxes?error=${code}`, request.url), 303)
  }
}
