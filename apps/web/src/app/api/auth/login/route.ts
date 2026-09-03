import { NextResponse } from 'next/server'

import { cmsRequest } from '@/lib/cms'
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session'
import {
  assertSameOrigin,
  clientIdentifier,
  enforceRateLimit,
  requestData,
  validEmail,
  validPassword,
} from '@/lib/security'
import { log } from '@/lib/services/logger'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    enforceRateLimit(`login:${clientIdentifier(request)}`, 8, 10 * 60 * 1000)
    const data = await requestData(request)
    const email = validEmail(data.email)
    const password = validPassword(data.password)
    const result = await cmsRequest<{ token: string; exp?: number }>('/api/customers/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const response = NextResponse.redirect(new URL('/account', request.url), 303)
    response.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions())
    return response
  } catch (error) {
    log('warn', 'auth.login_failed', { reason: error instanceof Error ? error.name : 'unknown' })
    return NextResponse.redirect(new URL('/account?error=invalid-credentials', request.url), 303)
  }
}
