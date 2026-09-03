import { NextResponse } from 'next/server'

import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session'
import { assertSameOrigin } from '@/lib/security'

export async function POST(request: Request) {
  assertSameOrigin(request)
  const response = NextResponse.redirect(new URL('/account', request.url), 303)
  response.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0))
  return response
}
