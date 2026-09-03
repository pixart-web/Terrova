import { NextResponse } from 'next/server'

import type { EntityID } from '@terrova/types'

import { getCurrentCustomer } from '@/lib/auth/session'
import { cmsRequest } from '@/lib/cms'
import { commerceGateway } from '@/lib/commerce/gateway'
import { assertSameOrigin } from '@/lib/security'
import { log } from '@/lib/services/logger'

type Document = Record<string, unknown> & { id: EntityID }

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const customer = await getCurrentCustomer()
    if (!customer) return NextResponse.redirect(new URL('/account', request.url), 303)
    const record = await cmsRequest<Document>(`/api/customers/${customer.id}?depth=0`, {
      service: true,
      cache: 'no-store',
    })
    const providerCustomerId = String(record.externalCustomerId ?? '')
    if (!providerCustomerId) throw new Error('Customer has no billing profile')
    const portal = await commerceGateway().createBillingPortal({
      providerCustomerId,
      returnUrl: new URL('/account', process.env.NEXT_PUBLIC_SITE_URL ?? request.url).toString(),
    })
    return NextResponse.redirect(portal.redirectUrl, 303)
  } catch (error) {
    log('error', 'billing_portal.failed', {
      errorType: error instanceof Error ? error.name : 'unknown',
    })
    return NextResponse.redirect(new URL('/account?error=billing', request.url), 303)
  }
}
