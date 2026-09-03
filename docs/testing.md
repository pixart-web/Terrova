# Testing and release evidence

## Layers

- `pnpm test:unit`: hostname/tenant resolution, taste aggregation, authenticated checkout invariants, provider-state ordering, webhook translation, Resend endpoint construction, safe redirects and order/inventory transitions.
- `pnpm test:functional`: running web/CMS reachability, seven-scene contract, route shells, public collection access, protected admin records, inventory reservation release and direct Payload customer authorization attacks.
- `pnpm test:e2e`: desktop and Pixel 7 homepage, guest → auth → resumed checkout, Customer/Stripe association, gift intent, customer login/My Terrova, rating submission, legal/editorial routes, automated WCAG A/AA scans and reduced-motion behavior.
- `pnpm check`: formatting, lint, TypeScript and production builds.

CI provisions PostgreSQL 17, applies the committed migration, runs the non-destructive seed, starts both applications and executes all layers. The commerce test adapter is enabled only through explicit CI variables. Failure artifacts retain Playwright traces, video and screenshots for seven days.

## Manual release pass

In staging, verify at 1440×900 and a representative 390px mobile viewport:

1. The seven scenes remain ordered and complete with motion enabled.
2. `prefers-reduced-motion: reduce` removes pinning/smooth scroll without hiding content.
3. Keyboard focus remains visible; dialogs keep attention appropriately and all actions have names.
4. Every public empty/error/loading/not-found state is coherent.
5. Checkout test mode, signed webhook replay, portal, password reset and an order through delivery behave as documented.
6. Lighthouse/mobile profiling shows no obvious long-task, image payload or layout-shift regression.

Screenshots or recordings used as PR evidence belong in `docs/evidence/` only when intentionally versioned; automated failure evidence stays in CI artifacts.
