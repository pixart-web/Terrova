# Terrova

Production-candidate foundation for a premium, cinematic, multi-brand wine membership. The pnpm monorepo contains a Next.js storefront, a separate Payload Studio, PostgreSQL persistence and provider-neutral commerce, content, email and analytics boundaries.

## Prerequisites

- Node.js 22.13+ (CI and containers use Node 24)
- pnpm 11.19
- Docker Desktop with WSL2, or any PostgreSQL 17 instance

## Local setup

```bash
pnpm install
pnpm env:setup
pnpm db:up
pnpm cms:migrate
pnpm cms:seed
pnpm dev
```

Open the storefront at `http://localhost:3000` and Payload Studio at `http://localhost:3001/admin`. Create the first administrative `Users` account in Studio. Customer accounts are a separate authenticated collection and never grant Studio access.

The seed is repeatable, preserves existing records and refuses production unless `ALLOW_PRODUCTION_SEED=true` is explicitly set. Development may use Payload schema push; staging and production must run committed migrations.

## Quality gates

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
pnpm test:functional  # applications must be running
pnpm test:e2e         # applications and Chromium must be available
```

`pnpm check` runs formatting, lint, typecheck and both production builds. CI adds PostgreSQL migration/seed, unit tests, functional smoke tests and desktop/mobile Playwright flows.

## Repository map

```text
apps/web       public Next.js experience, account and server-side application routes
apps/cms       Payload Studio/API, collections, migrations, seed and storage/email adapters
packages/ui    design tokens and shared presentation primitives
packages/types shared domain contracts
packages/content CMS repository and taste aggregation
packages/commerce Stripe and deterministic test adapters behind CommerceGateway
packages/config multi-brand defaults
docs            architecture, runbooks, testing and launch checklist
```

Start with [architecture](docs/architecture.md), then use [deployment](docs/deployment.md) and the [launch checklist](docs/launch-checklist.md) for a release. The production environment contract is in `.env.production.example`; real values belong in a secret manager, never Git.

## Current release boundary

The release candidate includes CMS-driven catalogue/editorial pages, customer authentication, My Terrova, Stripe Checkout/Portal/webhook synchronization, fulfilment inventory, Cellar ratings and transparent taste signals. Gift intent is persisted but intentionally does not charge or promise a duration until the commercial redemption policy is approved. Final legal copy, production keys, DNS and licensed photography are launch inputs, documented as external blockers rather than hidden code gaps.
