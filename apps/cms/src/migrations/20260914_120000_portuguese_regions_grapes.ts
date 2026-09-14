import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_grapes_status" AS ENUM('draft', 'scheduled', 'live', 'archived');

    ALTER TABLE "regions" ADD COLUMN "tagline" varchar DEFAULT '' NOT NULL;
    ALTER TABLE "regions" ADD COLUMN "short_description" varchar DEFAULT '' NOT NULL;

    ALTER TABLE "grapes" ADD COLUMN "status" "enum_grapes_status" DEFAULT 'draft' NOT NULL;
    ALTER TABLE "grapes" ADD COLUMN "tagline" varchar DEFAULT '' NOT NULL;
    ALTER TABLE "grapes" ADD COLUMN "short_description" varchar DEFAULT '' NOT NULL;
    CREATE INDEX "grapes_status_idx" ON "grapes" USING btree ("status");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "grapes_status_idx";

    ALTER TABLE "grapes" DROP COLUMN "short_description";
    ALTER TABLE "grapes" DROP COLUMN "tagline";
    ALTER TABLE "grapes" DROP COLUMN "status";

    ALTER TABLE "regions" DROP COLUMN "short_description";
    ALTER TABLE "regions" DROP COLUMN "tagline";

    DROP TYPE "public"."enum_grapes_status";
  `)
}
