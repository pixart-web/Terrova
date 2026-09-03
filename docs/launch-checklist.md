# Release candidate launch checklist

## Code and data

- [ ] PR approved; CI format, lint, typecheck, unit, build, functional and E2E gates green.
- [ ] Images built from one immutable SHA and vulnerability-scanned by the hosting platform.
- [ ] Staging restored from representative data; committed migration applied successfully.
- [ ] Backup and rollback restoration tested.
- [ ] Active Brands, hostnames, Plans, live content, Editions, ready Boxes and inventory reviewed.

## External configuration

- [ ] Production Stripe products/prices, Portal and signed webhook configured.
- [ ] Resend domain, SPF/DKIM and sender verified.
- [ ] PostHog retention, region and consent behavior approved.
- [ ] S3-compatible media bucket, least privilege, CORS, CDN and backups configured.
- [ ] Web/Studio/media DNS and TLS validated.
- [ ] Secrets random, separated, stored in a manager and absent from logs/source.

## Product, legal and content

- [ ] Qualified legal approval for terms, privacy, cookies, shipping, returns, responsible drinking, age gate and marketing consent wording.
- [ ] Supported shipping countries, delivery SLA, refunds, taxes and customer support ownership approved.
- [ ] Gift duration/redemption/refund policy approved before gift billing is enabled.
- [ ] Licensed final photography, alt text and credits published; temporary visual assets explicitly accepted if retained.

## Release day

- [ ] Database snapshot and media backup marker captured.
- [ ] Migration job succeeds before application rollout.
- [ ] CMS health, then web health, then critical journeys verified.
- [ ] Webhook, email, 5xx, latency and checkout monitoring active with named responders.
- [ ] Previous images and database restore instructions immediately available.
