import { NextResponse } from 'next/server'

import { cmsRequest } from '@/lib/cms'
import {
  assertSameOrigin,
  cleanText,
  clientIdentifier,
  enforceRateLimit,
  requestData,
  validPassword,
} from '@/lib/security'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    enforceRateLimit(`reset:${clientIdentifier(request)}`, 6, 60 * 60 * 1000)
    const data = await requestData(request)
    const token = cleanText(data.token, 500)
    if (!token) throw new Error('Reset token is required')
    await cmsRequest('/api/customers/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password: validPassword(data.password) }),
    })
    return NextResponse.redirect(new URL('/account?reset=1', request.url), 303)
  } catch {
    return NextResponse.redirect(new URL('/account/reset-password?error=invalid', request.url), 303)
  }
}
