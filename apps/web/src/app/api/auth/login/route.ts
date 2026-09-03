import { NextResponse } from 'next/server'

import { cmsRequest } from '@/lib/cms'
import { PENDING_CHECKOUT_COOKIE, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session'
import {
  assertSameOrigin,
  clientIdentifier,
  enforceRateLimit,
  requestData,
  safeInternalPath,
  validEmail,
  validPassword,
} from '@/lib/security'
import { log } from '@/lib/services/logger'

export async function POST(request: Request) {
  let returnTo = '/account'
  try {
    assertSameOrigin(request)
    enforceRateLimit(`login:${clientIdentifier(request)}`, 8, 10 * 60 * 1000)
    const data = await requestData(request)
    const email = validEmail(data.email)
    const password = validPassword(data.password)
    returnTo = safeInternalPath(data.returnTo)
    const result = await cmsRequest<{ token: string; exp?: number }>('/api/customers/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const response = NextResponse.redirect(new URL(returnTo, request.url), 303)
    response.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions())
    response.cookies.delete(PENDING_CHECKOUT_COOKIE)
    return response
  } catch (error) {
    log('warn', 'auth.login_failed', { reason: error instanceof Error ? error.name : 'unknown' })
    const destination = new URL('/account', request.url)
    destination.searchParams.set('error', 'invalid-credentials')
    if (returnTo !== '/account') destination.searchParams.set('returnTo', returnTo)
    return NextResponse.redirect(destination, 303)
  }
}
