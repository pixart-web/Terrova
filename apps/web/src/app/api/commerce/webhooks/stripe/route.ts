import { processCommerceEvent, parseStripeEvent } from '@terrova/commerce'

import {
  PayloadCommerceEventStore,
  PayloadSubscriptionSyncTarget,
} from '@/lib/commerce/payload-store'
import { log } from '@/lib/services/logger'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let eventId: string | undefined
  const store = new PayloadCommerceEventStore()
  try {
    const event = parseStripeEvent(
      process.env.STRIPE_SECRET_KEY,
      process.env.STRIPE_WEBHOOK_SECRET,
      await request.text(),
      request.headers.get('stripe-signature'),
    )
    eventId = event.id
    if (await store.hasProcessed(event.id))
      return Response.json({ received: true, duplicate: true })
    await store.markProcessing(event)
    const result = await processCommerceEvent(event, new PayloadSubscriptionSyncTarget())
    if (result === 'ignored') await store.markIgnored(event.id)
    else await store.markProcessed(event.id)
    log('info', 'stripe.webhook_processed', { eventId: event.id, eventType: event.type, result })
    return Response.json({ received: true })
  } catch (error) {
    const errorType = error instanceof Error ? error.name : 'unknown'
    if (eventId) {
      try {
        await store.markFailed(eventId, errorType)
      } catch {
        log('error', 'stripe.webhook_status_failed', { eventId })
      }
    }
    log('error', 'stripe.webhook_failed', { eventId, errorType })
    return Response.json(
      { error: eventId ? 'Webhook processing failed' : 'Invalid webhook' },
      { status: eventId ? 500 : 400 },
    )
  }
}
