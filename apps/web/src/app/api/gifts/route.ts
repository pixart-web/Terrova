import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'

import { getCurrentCustomer } from '@/lib/auth/session'
import { cmsRequest } from '@/lib/cms'
import { contentRepository, requestBrand } from '@/lib/content'
import {
  assertSameOrigin,
  cleanText,
  clientIdentifier,
  enforceRateLimit,
  requestData,
  validEmail,
} from '@/lib/security'
import { analyticsConsent, captureEvent } from '@/lib/services/analytics'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    enforceRateLimit(`gift:${clientIdentifier(request)}`, 6, 60 * 60 * 1000)
    const data = await requestData(request)
    const [{ brand }, customer] = await Promise.all([requestBrand(), getCurrentCustomer()])
    const planCode = cleanText(data.plan, 40)
    const plan = await contentRepository.getPlan(brand.id, planCode)
    if (!plan) throw new Error('Invalid gift plan')
    const startsAt = cleanText(data.startsAt, 40)
    const recipientName = cleanText(data.recipientName, 120)
    if (!recipientName) throw new Error('Recipient name is required')
    await cmsRequest('/api/gifts', {
      service: true,
      method: 'POST',
      body: JSON.stringify({
        code: `GFT-${randomUUID()}`,
        brand: brand.id,
        customer: customer?.id,
        plan: plan.id,
        purchaserEmail: validEmail(data.purchaserEmail),
        recipientName,
        recipientEmail: validEmail(data.recipientEmail),
        message: cleanText(data.message, 1000),
        startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
        status: 'draft',
      }),
    })
    if (analyticsConsent(request)) {
      await captureEvent('gift_started', { brand: brand.slug, plan: plan.code })
    }
    return NextResponse.redirect(new URL('/gifts?submitted=1', request.url), 303)
  } catch {
    return NextResponse.redirect(new URL('/gifts?error=invalid', request.url), 303)
  }
}
