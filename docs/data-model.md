# Data model and operational lifecycle

## Ownership

| Domain     | Collections                                            |                 Public read | Write authority                            |
| ---------- | ------------------------------------------------------ | --------------------------: | ------------------------------------------ |
| Tenant     | Brands, SiteSettings                                   |      active/configured data | Studio/service                             |
| Catalogue  | Countries, Regions, Grapes, Producers, Wines, WineSKUs |            live/active data | Studio/service                             |
| Membership | Plans, Editions, Boxes                                 |      active/live/ready data | Studio/service                             |
| Customer   | Customers, Addresses                                   |                  owner only | owner with protected fields; service/admin |
| Commerce   | Subscriptions, Orders, OrderItems, Gifts, Promotions   | owner only where applicable | service/admin                              |
| Operations | InventoryMovements                                     |                          no | service/admin; immutable after creation    |
| Taste      | CellarEntries, Ratings, TasteSignals                   |                  owner only | constrained customer/service/admin         |
| Editorial  | JournalPosts, Pages, Media                             |                   live data | Studio/service                             |
| System     | WebhookEvents                                          |                          no | service/admin; never deleted through API   |

Relationships use PostgreSQL numeric IDs. `Brand` is required on tenant-owned aggregate roots. A later brand must receive its own hostnames, settings, plans and content; no Terrova slug or colour is required by the domain interfaces.

## Wine and inventory

`Wines` describe origin, producer, grapes, vintage, style and story. `WineSKUs` describe bottle size, price, provider references and stock. `InventoryMovements` are immutable audit entries with on-hand and reserved deltas plus post-movement balances. The hook rejects overselling and negative reservation balances.

## Order lifecycle

```text
pending → paid → preparing → shipped → delivered
    ↘ cancelled    ↘ cancelled/refunded  ↘ refunded
```

Webhook invoice success creates/updates the paid order. An operator assigns its Box and shipping address, then moves it to `preparing`; Box SKUs become OrderItems and inventory reservations. A tracking reference is mandatory for `shipped`, which consumes the reserved stock. `delivered` materializes CellarEntries once. Terminal transitions cannot reopen an order.

## Subscription lifecycle

Provider states are mapped into `pending`, `active`, `paused`, `payment_issue` and `cancelled`. The provider subscription ID is unique and is the synchronization key. Stripe remains the billing authority; local records are the customer/operations read model.

## Publication lifecycle

Editorial entities use `draft`, `scheduled`, `live`, `archived`. Boxes use `draft`, `ready`, `packing`, `closed`, `archived`. Public APIs expose only semantically publishable records. Scheduled publication dates are stored, while promotion to `live` remains an explicit Studio operation in this candidate.
