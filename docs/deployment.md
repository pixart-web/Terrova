# Deployment and rollback

## Target topology

Deploy `apps/cms/Dockerfile` and `apps/web/Dockerfile` as separate HTTPS services. Use managed PostgreSQL 17 and S3-compatible object storage for production; `docker-compose.production.yml` is a reproducible single-host reference, not a substitute for managed backups or TLS termination.

## Exact release procedure

1. Choose the reviewed commit SHA and build both images from the same SHA. Tag images with that immutable SHA.
2. Provision PostgreSQL, media bucket/CDN, web and Studio hostnames, TLS and a secret manager. Copy keys from `.env.production.example` into the manager; never create a committed `.env.production`.
3. Restore the latest production backup into staging and run `pnpm cms:migrate`. Start candidate images and complete the manual/automated staging pass.
4. In Stripe live mode, create one recurring Price per active Plan and place IDs in production CMS records. Configure Portal and the signed webhook events in `commerce.md`.
5. Verify Resend sending domain, PostHog region/retention, S3 CORS, DNS and legal/privacy approvals. Publish licensed media and final copy in Studio.
6. Schedule release, pause mutating operator work and take a named PostgreSQL snapshot plus an object-storage backup marker.
7. Run a one-off migration job using the CMS image: `pnpm cms:migrate`. Never run schema push in production.
8. If reference records are absent, run once with `ALLOW_PRODUCTION_SEED=true pnpm cms:seed`, inspect it, then remove the flag. Existing records are preserved and provider IDs are never invented.
9. Deploy CMS first and wait for `/api/health`; deploy web second and wait for `/api/health`. Keep prior images available.
10. Run `pnpm test:functional` against production URLs for its read-only checks, then manually verify signup email, live-mode-safe checkout, a signed webhook and My Terrova.
11. Shift traffic and monitor 5xx/latency, webhook failures, email delivery and checkout completion. Announce only after the observation window is clean.

## Rollback

If behavior regresses without schema incompatibility, route traffic to the previous web/CMS image and retain the migrated database. If the migration causes corruption or incompatibility, stop writes, preserve the failed database, restore the pre-release snapshot to a new database, point the prior CMS image to it, verify health and restore traffic. Do not casually execute generated down migrations: the baseline down path is destructive.

Reconcile provider events received during an outage from Stripe’s event log using original event IDs. Idempotency prevents duplicate application.

## Backup expectations

- PostgreSQL: point-in-time recovery plus daily snapshots; practice quarterly restore.
- Object storage: versioning and lifecycle protection; retain media independently from app images.
- Secrets/configuration: versioned infrastructure without secret values.
- Stripe/Resend/PostHog: provider retention and export policies documented by the operator.
