import { headers } from 'next/headers'

import { PayloadContentRepository } from './payload-repository'

export const contentRepository = new PayloadContentRepository(
  process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001',
  process.env.ALLOW_CONTENT_FIXTURES !== 'false' && process.env.NODE_ENV !== 'production',
)

export async function requestBrand() {
  const requestHeaders = await headers()
  const forwardedHost = requestHeaders.get('x-forwarded-host')
  return contentRepository.resolveBrand(forwardedHost ?? requestHeaders.get('host') ?? undefined)
}
