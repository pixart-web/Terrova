# Terrova

Premium, cinematic, multi-brand wine subscription platform. The repository is a pnpm monorepo with a public Next.js experience, a separate Payload CMS studio, shared domain packages, and local PostgreSQL.

## Prerequisites

- Node.js 20.9 or newer
- pnpm 11
- Docker Desktop with the WSL 2 backend

## Local setup

```bash
pnpm install
pnpm db:up
pnpm dev
```

Open:

- Web experience: http://localhost:3000
- Payload admin: http://localhost:3001/admin

On the first admin visit, create the initial Payload user. In development, Payload pushes the code-first collection schema to the local PostgreSQL database automatically.

The repository includes a safe local `apps/cms/.env` for first boot. Copy the relevant `.env.example` files and replace every secret before using a shared or production environment.

## Commands

```bash
pnpm dev                 # web + CMS
pnpm dev:web             # frontend only
pnpm dev:cms             # Payload only
pnpm build               # production builds
pnpm lint                # ESLint across apps
pnpm typecheck           # TypeScript across apps
pnpm format:check        # Prettier verification
pnpm cms:generate:types  # regenerate Payload types
pnpm cms:generate:schema # regenerate the PostgreSQL schema snapshot
pnpm cms:migrate:create  # create a production database migration
pnpm db:down             # stop local PostgreSQL
```

## Repository map

```text
apps/
  web/       Next.js App Router storefront and cinematic scene system
  cms/       Payload admin, REST API, collections and migrations
packages/
  ui/        reusable presentation primitives and tokens
  config/    brand registry defaults and design tokens
  types/     shared domain contracts
  commerce/  payment-provider boundaries; no Stripe implementation yet
  content/   CMS-facing repository boundaries
docs/
  architecture.md
```

Read [docs/architecture.md](docs/architecture.md) before adding new product domains or integrating Stripe.
