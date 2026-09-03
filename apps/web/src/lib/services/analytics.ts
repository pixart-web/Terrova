export type AnalyticsEvent =
  | 'plan_viewed'
  | 'plan_selected'
  | 'checkout_started'
  | 'checkout_completed'
  | 'account_created'
  | 'rating_submitted'
  | 'gift_started'
  | 'gift_completed'

export async function captureEvent(
  event: AnalyticsEvent,
  properties: Record<string, string | number | boolean | undefined> = {},
) {
  const key = process.env.POSTHOG_KEY
  if (!key) return
  const host = process.env.POSTHOG_HOST ?? 'https://eu.i.posthog.com'
  await fetch(new URL('/capture/', host), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: key,
      event,
      properties: { distinct_id: 'anonymous', ...properties },
    }),
    cache: 'no-store',
  })
}

export function analyticsConsent(request: Request) {
  return request.headers.get('cookie')?.includes('terrova-analytics=granted') ?? false
}
