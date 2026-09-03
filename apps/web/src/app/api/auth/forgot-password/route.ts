import { NextResponse } from 'next/server'

import { cmsRequest } from '@/lib/cms'
import {
  assertSameOrigin,
  clientIdentifier,
  enforceRateLimit,
  requestData,
  validEmail,
} from '@/lib/security'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    enforceRateLimit(`forgot:${clientIdentifier(request)}`, 4, 60 * 60 * 1000)
    const data = await requestData(request)
    await cmsRequest('/api/customers/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: validEmail(data.email) }),
    })
  } catch {
    // Deliberately return the same state to prevent account enumeration.
  }
  return NextResponse.redirect(new URL('/account/forgot-password?sent=1', request.url), 303)
}
