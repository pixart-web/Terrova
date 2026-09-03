# Payload Studio operations

## Roles

- `Users` are trusted Studio operators and can edit content/operations.
- `Customers` authenticate only to My Terrova and cannot access Studio.
- The service token is for server-to-server operations and must be long, random, rotated and absent from browser bundles.

## Publishing an edition

1. Confirm Country, Region, Grapes and Producer are live.
2. Create each Wine editorial record, then its distinct WineSKU bottle record.
3. Record stock receipts through InventoryMovements; never edit balances as an operational shortcut.
4. Create an Edition with period, plans, WineSKUs and narrative; publish it live.
5. Create one Box per eligible Plan, verify packing note/deadlines and move it to ready.
6. Preview `/boxes`, producer/wine pages and mobile layouts before promotion.

## Fulfilment

1. Verify a paid Order has the correct Subscription, address and Edition.
2. Assign the matching ready Box.
3. Move to preparing; inspect generated OrderItems and allocation movements.
4. Pack against the item ledger, add tracking, then move to shipped.
5. Mark delivered only on carrier confirmation; Cellar entries are created automatically.

Never retry a failed lifecycle action by creating duplicate records. Inspect the deterministic movement references and webhook event status first.

## Content and legal

Journal and Page documents are draft-first. Legal pages are real CMS entries, but `termsReviewedAt` and `privacyReviewedAt` in SiteSettings must be populated only after qualified approval. Media requires meaningful alt text, credit and usage rights.

## Seed and migrations

`pnpm cms:seed` creates missing reference/demo records and preserves existing data. Production execution requires `ALLOW_PRODUCTION_SEED=true` and should be a one-off operator action. `pnpm cms:migrate` applies committed migrations. Take a verified backup before every production migration.
