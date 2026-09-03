const cmsURL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

export interface PayloadList<T> {
  docs: T[]
  totalDocs: number
}

export async function cmsRequest<T>(
  path: string,
  init: RequestInit & { service?: boolean; token?: string } = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (init.service) {
    if (!process.env.CMS_SERVICE_TOKEN) throw new Error('CMS service token is not configured')
    headers.set('x-terrova-service-token', process.env.CMS_SERVICE_TOKEN)
  }
  if (init.token) headers.set('Authorization', `JWT ${init.token}`)

  const response = await fetch(new URL(path, cmsURL), {
    ...init,
    headers,
    cache: init.method && init.method !== 'GET' ? 'no-store' : init.cache,
  })
  if (!response.ok) {
    const error = new Error(`CMS request failed (${response.status})`)
    Object.assign(error, { status: response.status })
    throw error
  }
  return (await response.json()) as T
}

export function cmsWhere(entries: Record<string, string | number | boolean | undefined>) {
  const params = new URLSearchParams({ depth: '3', limit: '100' })
  Object.entries(entries).forEach(([key, value]) => {
    if (value !== undefined) params.set(`where[${key}][equals]`, String(value))
  })
  return params.toString()
}
