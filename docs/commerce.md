# Commerce, gifts and integrations

## Stripe

`CommerceGateway` is the only billing port. The Stripe adapter creates customers, subscription checkout sessions, billing portal sessions and parses signed events. CMS Plans store environment-specific Stripe Price IDs. Never copy test IDs into production.

Configure the webhook endpoint:

```text
POST https://terrova.net/api/commerce/webhooks/stripe
```

Required event families are `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid` and `invoice.payment_failed`. Delivery must use HTTPS. The endpoint records each provider event ID before work, so retries are idempotent and failures remain auditable/retryable.

The success URL communicates receipt only; Stripe webhooks establish billing truth. Customer cancellation/payment-method management stays in Stripe Portal.

## Gifts

The public flow records a validated Gift intent linked to a Plan and optional purchaser customer. It does not initiate payment, generate a redemption secret or email the recipient. Before enabling purchase, product owners must approve duration, activation timing, recipient eligibility, renewal behavior, refunds and tax treatment. Implementation must then reuse CommerceGateway and hash one-time redemption tokens.

## Email

Payload authentication and web transactional messages use a Resend-compatible HTTP adapter. Without `RESEND_API_KEY`, development logs a non-PII delivery summary and production configuration is considered incomplete. Verify the sending domain and DKIM/SPF before launch.

## Analytics

Server events use a PostHog-compatible capture boundary and contain product references, never raw customer profile data. No event is sent without the explicit analytics consent cookie. Define retention and deletion policy in PostHog before production.

## Media

Payload uses its official S3-compatible storage plugin when `S3_BUCKET` is set. Provide a dedicated bucket, least-privilege credentials, CORS for Studio, CDN/media hostname and lifecycle/backup policy. Local disk is development-only.
