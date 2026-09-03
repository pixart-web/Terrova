# Authentication and security

## Customer flow

Signup validates name, email, a 12–128 character password, terms/age confirmation and optional marketing consent. Payload sends a branded verification link to the web. Login returns a short-lived JWT stored only in an HttpOnly cookie. Forgot/reset responses avoid account enumeration. Logout expires the cookie.

My Terrova reads Subscriptions, Orders, Addresses, Cellar, Ratings and TasteSignals through row-level Payload access filters. Direct Payload API address and rating mutations derive Customer and brand from the authenticated Customer. Rating hooks validate Wine brand and CellarEntry customer/brand/wine ownership. Customer-controlled fields cannot change brand, status or provider customer reference.

## Request controls

- Mutation routes enforce same-origin browser requests.
- Login, signup, reset and gift intent are rate limited.
- Checkout and portal destinations are server-generated; external return URLs are rejected in the commerce package.
- Stripe webhook bodies are verified before parsing and processing.
- Logs filter names suggesting email, address, token, password, secret or raw payload.
- Analytics is absent until the consent cookie is granted.
- JSON-LD escapes `<` before injection.

## Secrets

Use separate values for `PAYLOAD_SECRET`, `CMS_SERVICE_TOKEN`, database credentials, Stripe, Resend, PostHog and S3. Minimum application secret length is enforced in production. Store values in the platform secret manager and rotate the service token on suspected exposure.

## Security response

1. Disable affected keys at the provider.
2. Rotate app secrets and redeploy both runtimes.
3. Review WebhookEvents, auth lockouts, provider logs and infrastructure access logs.
4. Preserve evidence; do not delete audit records.
5. Follow the applicable notification/legal process.

## Known scaling constraint

Application rate limiting is currently process-local. Before running multiple web replicas, place login/signup/reset/gift endpoints behind provider rate limits or replace the map with a shared atomic store. This is a launch blocker for horizontally scaled public traffic, not for a controlled single-replica candidate.
