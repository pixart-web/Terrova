import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { createEmailAdapter } from './services/email'

import {
  Addresses,
  Boxes,
  Brands,
  CellarEntries,
  Countries,
  Customers,
  Editions,
  Gifts,
  Grapes,
  InventoryMovements,
  JournalPosts,
  Media,
  OrderItems,
  Orders,
  Pages,
  Plans,
  Producers,
  Promotions,
  Ratings,
  Regions,
  SiteSettings,
  Subscriptions,
  TasteSignals,
  Users,
  WebhookEvents,
  Wines,
  WineSKUs,
} from './collections'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseURL =
  process.env.DATABASE_URL ?? 'postgresql://terrova:terrova@localhost:5432/terrova'
const payloadSecret = process.env.PAYLOAD_SECRET ?? 'local-development-only-change-me'

if (process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required in production')
  if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) {
    throw new Error('PAYLOAD_SECRET must be at least 32 characters in production')
  }
  if (!process.env.CMS_SERVICE_TOKEN || process.env.CMS_SERVICE_TOKEN.length < 32) {
    throw new Error('CMS_SERVICE_TOKEN must be at least 32 characters in production')
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Terrova Studio',
      description: 'Terrova multi-brand wine content studio',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Brands,
    Plans,
    Wines,
    WineSKUs,
    Producers,
    Countries,
    Regions,
    Grapes,
    Editions,
    Boxes,
    InventoryMovements,
    Customers,
    Addresses,
    Subscriptions,
    Orders,
    OrderItems,
    CellarEntries,
    Ratings,
    TasteSignals,
    JournalPosts,
    Pages,
    Gifts,
    Promotions,
    SiteSettings,
    WebhookEvents,
    Media,
    Users,
  ],
  cors: [process.env.WEB_URL ?? 'http://localhost:3000'],
  csrf: [process.env.CMS_URL ?? 'http://localhost:3001'],
  db: postgresAdapter({
    pool: { connectionString: databaseURL },
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  editor: lexicalEditor(),
  email: createEmailAdapter(),
  plugins: [
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      alwaysInsertFields: true,
      bucket: process.env.S3_BUCKET ?? 'terrova-not-configured',
      collections: { media: { prefix: 'media' } },
      config: {
        region: process.env.S3_REGION ?? 'auto',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
        credentials:
          process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
            ? {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
              }
            : undefined,
      },
    }),
  ],
  secret: payloadSecret,
  serverURL: process.env.CMS_URL ?? 'http://localhost:3001',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
