const attempts = new Map<string, { count: number; resetsAt: number }>()

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return
  if (new URL(origin).origin !== new URL(request.url).origin)
    throw new Error('Invalid request origin')
}

export function clientIdentifier(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
}

export function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || current.resetsAt <= now) {
    attempts.set(key, { count: 1, resetsAt: now + windowMs })
    return
  }
  if (current.count >= limit) throw new Error('Too many requests')
  current.count += 1
}

export function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function validEmail(value: unknown): string {
  const email = cleanText(value, 320).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('A valid email is required')
  return email
}

export function validPassword(value: unknown): string {
  const password = typeof value === 'string' ? value : ''
  if (password.length < 12 || password.length > 128) {
    throw new Error('Password must contain between 12 and 128 characters')
  }
  return password
}

export async function requestData(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json'))
    return (await request.json()) as Record<string, unknown>
  const form = await request.formData()
  return Object.fromEntries(form.entries())
}

export function safeErrorStatus(error: unknown) {
  const message = error instanceof Error ? error.message : 'Request failed'
  if (message === 'Too many requests') return 429
  if (
    message.startsWith('Invalid') ||
    message.includes('required') ||
    message.includes('Password')
  ) {
    return 400
  }
  return 500
}
