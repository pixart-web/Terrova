import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import {
  Boxes,
  Brands,
  Countries,
  Editions,
  Grapes,
  Media,
  Plans,
  Producers,
  Regions,
  Users,
  Wines,
  WineSKUs,
} from './collections'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseURL =
  process.env.DATABASE_URL ?? 'postgresql://terrova:terrova@localhost:5432/terrova'
const payloadSecret = process.env.PAYLOAD_SECRET ?? 'local-development-only-change-me'

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
  secret: payloadSecret,
  serverURL: process.env.CMS_URL ?? 'http://localhost:3001',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
