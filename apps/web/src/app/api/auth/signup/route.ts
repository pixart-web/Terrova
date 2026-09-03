import { NextResponse } from 'next/server'

import { cmsRequest } from '@/lib/cms'
import { requestBrand } from '@/lib/content'
import {
  assertSameOrigin,
  cleanText,
  clientIdentifier,
  enforceRateLimit,
  requestData,
  validEmail,
  validPassword,
} from '@/lib/security'
import { analyticsConsent, captureEvent } from '@/lib/services/analytics'
import { log } from '@/lib/services/logger'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    enforceRateLimit(`signup:${clientIdentifier(request)}`, 5, 60 * 60 * 1000)
    const data = await requestData(request)
    const email = validEmail(data.email)
    const password = validPassword(data.password)
    const name = cleanText(data.name, 120)
    if (!name || data.terms !== 'accepted')
      throw new Error('Name and terms acceptance are required')
    const { brand } = await requestBrand()
    await cmsRequest('/api/customers', {
      service: true,
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        name,
        brand: brand.id,
        status: 'pending_verification',
        termsAcceptedAt: new Date().toISOString(),
        marketingConsent: data.marketing === 'accepted',
      }),
    })
    if (analyticsConsent(request)) await captureEvent('account_created', { brand: brand.slug })
    return NextResponse.redirect(new URL('/account?created=1', request.url), 303)
  } catch (error) {
    log('warn', 'auth.signup_failed', { reason: error instanceof Error ? error.name : 'unknown' })
    return NextResponse.redirect(new URL('/account?error=signup', request.url), 303)
  }
}
