import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_brands_currency" AS ENUM('EUR', 'GBP', 'USD');
  CREATE TYPE "public"."enum_plans_cadence" AS ENUM('monthly', 'bi_monthly', 'quarterly');
  CREATE TYPE "public"."enum_plans_currency" AS ENUM('EUR', 'GBP', 'USD');
  CREATE TYPE "public"."enum_wines_status" AS ENUM('draft', 'scheduled', 'live', 'archived');
  CREATE TYPE "public"."enum_wines_style" AS ENUM('red', 'white', 'rosé', 'orange', 'sparkling', 'fortified');
  CREATE TYPE "public"."enum_wine_skus_currency" AS ENUM('EUR', 'GBP', 'USD');
  CREATE TYPE "public"."enum_producers_status" AS ENUM('draft', 'scheduled', 'live', 'archived');
  CREATE TYPE "public"."enum_regions_status" AS ENUM('draft', 'scheduled', 'live', 'archived');
  CREATE TYPE "public"."enum_grapes_colour" AS ENUM('red', 'white', 'pink', 'grey');
  CREATE TYPE "public"."enum_editions_status" AS ENUM('draft', 'scheduled', 'live', 'archived');
  CREATE TYPE "public"."enum_boxes_status" AS ENUM('draft', 'ready', 'packing', 'closed', 'archived');
  CREATE TYPE "public"."enum_inventory_movements_reason" AS ENUM('receipt', 'allocation', 'release', 'fulfilment', 'adjustment', 'damage', 'return');
  CREATE TYPE "public"."enum_customers_status" AS ENUM('pending_verification', 'active', 'disabled');
  CREATE TYPE "public"."enum_subscriptions_status" AS ENUM('pending', 'active', 'paused', 'payment_issue', 'cancelled');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_orders_currency" AS ENUM('EUR', 'GBP', 'USD');
  CREATE TYPE "public"."enum_order_items_currency" AS ENUM('EUR', 'GBP', 'USD');
  CREATE TYPE "public"."enum_taste_signals_category" AS ENUM('grape', 'region', 'country', 'style');
  CREATE TYPE "public"."enum_journal_posts_status" AS ENUM('draft', 'scheduled', 'live', 'archived');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'scheduled', 'live', 'archived');
  CREATE TYPE "public"."enum_gifts_status" AS ENUM('draft', 'checkout_pending', 'purchased', 'notified', 'redeemed', 'cancelled');
  CREATE TYPE "public"."enum_webhook_events_provider" AS ENUM('stripe');
  CREATE TYPE "public"."enum_webhook_events_status" AS ENUM('processing', 'processed', 'failed', 'ignored');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "brands_hostnames" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hostname" varchar NOT NULL
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"locale" varchar DEFAULT 'en-GB' NOT NULL,
  	"support_email" varchar DEFAULT 'hello@terrova.net' NOT NULL,
  	"active" boolean DEFAULT true,
  	"currency" "enum_brands_currency" DEFAULT 'EUR' NOT NULL,
  	"theme_ink" varchar DEFAULT '#171714' NOT NULL,
  	"theme_cream" varchar DEFAULT '#F3EFE4' NOT NULL,
  	"theme_accent" varchar DEFAULT '#B65F43' NOT NULL,
  	"theme_secondary" varchar DEFAULT '#35483A' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"description" varchar,
  	"positioning" varchar NOT NULL,
  	"most_popular" boolean DEFAULT false,
  	"cadence" "enum_plans_cadence" NOT NULL,
  	"price_amount" numeric NOT NULL,
  	"currency" "enum_plans_currency" DEFAULT 'EUR' NOT NULL,
  	"external_price_id" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_wines_status" DEFAULT 'draft' NOT NULL,
  	"introduction" varchar,
  	"producer_id" integer NOT NULL,
  	"country_id" integer NOT NULL,
  	"region_id" integer NOT NULL,
  	"vintage" numeric,
  	"style" "enum_wines_style",
  	"story" jsonb,
  	"label_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wines_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"grapes_id" integer
  );
  
  CREATE TABLE "wine_skus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"wine_id" integer NOT NULL,
  	"brand_id" integer NOT NULL,
  	"sku" varchar NOT NULL,
  	"bottle_size_ml" numeric DEFAULT 750 NOT NULL,
  	"price_amount" numeric NOT NULL,
  	"currency" "enum_wine_skus_currency" DEFAULT 'EUR' NOT NULL,
  	"active" boolean DEFAULT true,
  	"stock_on_hand" numeric DEFAULT 0 NOT NULL,
  	"stock_reserved" numeric DEFAULT 0 NOT NULL,
  	"external_product_id" varchar,
  	"external_price_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "producers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_producers_status" DEFAULT 'draft' NOT NULL,
  	"introduction" varchar,
  	"country_id" integer NOT NULL,
  	"region_id" integer,
  	"portrait_id" integer,
  	"story" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "producers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer
  );
  
  CREATE TABLE "countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_regions_status" DEFAULT 'draft' NOT NULL,
  	"country_id" integer NOT NULL,
  	"story" jsonb,
  	"hero_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "grapes_aliases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "grapes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"colour" "enum_grapes_colour",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "editions_story_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "editions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_editions_status" DEFAULT 'draft' NOT NULL,
  	"period" varchar NOT NULL,
  	"period_start" timestamp(3) with time zone NOT NULL,
  	"period_end" timestamp(3) with time zone NOT NULL,
  	"publish_at" timestamp(3) with time zone,
  	"region_id" integer,
  	"hero_id" integer,
  	"narrative" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "editions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"plans_id" integer,
  	"wine_skus_id" integer
  );
  
  CREATE TABLE "boxes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL,
  	"edition_id" integer NOT NULL,
  	"plan_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"status" "enum_boxes_status" DEFAULT 'draft' NOT NULL,
  	"packing_note" varchar,
  	"packing_deadline" timestamp(3) with time zone,
  	"expected_ship_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "boxes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"wine_skus_id" integer
  );
  
  CREATE TABLE "inventory_movements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"brand_id" integer NOT NULL,
  	"sku_id" integer NOT NULL,
  	"order_id" integer,
  	"reason" "enum_inventory_movements_reason" NOT NULL,
  	"quantity_delta" numeric NOT NULL,
  	"reserved_delta" numeric DEFAULT 0 NOT NULL,
  	"balance_after" numeric NOT NULL,
  	"reserved_balance_after" numeric NOT NULL,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"status" "enum_customers_status" DEFAULT 'active' NOT NULL,
  	"external_customer_id" varchar,
  	"marketing_consent" boolean DEFAULT false,
  	"terms_accepted_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"_verified" boolean,
  	"_verificationtoken" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "addresses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"brand_id" integer NOT NULL,
  	"label" varchar DEFAULT 'Home' NOT NULL,
  	"recipient_name" varchar NOT NULL,
  	"line1" varchar NOT NULL,
  	"line2" varchar,
  	"city" varchar NOT NULL,
  	"postal_code" varchar NOT NULL,
  	"country_code" varchar NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"brand_id" integer NOT NULL,
  	"customer_id" integer NOT NULL,
  	"plan_id" integer NOT NULL,
  	"status" "enum_subscriptions_status" DEFAULT 'pending' NOT NULL,
  	"current_period_start" timestamp(3) with time zone,
  	"current_period_end" timestamp(3) with time zone,
  	"cancel_at_period_end" boolean DEFAULT false,
  	"provider_subscription_id" varchar,
  	"provider_customer_id" varchar,
  	"last_provider_event_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"brand_id" integer NOT NULL,
  	"customer_id" integer NOT NULL,
  	"subscription_id" integer,
  	"edition_id" integer,
  	"box_id" integer,
  	"shipping_address_id" integer,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"total_amount" numeric NOT NULL,
  	"currency" "enum_orders_currency" NOT NULL,
  	"provider_checkout_id" varchar,
  	"provider_invoice_id" varchar,
  	"paid_at" timestamp(3) with time zone,
  	"shipped_at" timestamp(3) with time zone,
  	"tracking_reference" varchar,
  	"operator_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "order_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_id" integer NOT NULL,
  	"customer_id" integer NOT NULL,
  	"brand_id" integer NOT NULL,
  	"wine_s_k_u_id" integer,
  	"description" varchar NOT NULL,
  	"quantity" numeric NOT NULL,
  	"unit_amount" numeric NOT NULL,
  	"currency" "enum_order_items_currency" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cellar_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"brand_id" integer NOT NULL,
  	"wine_id" integer NOT NULL,
  	"wine_s_k_u_id" integer,
  	"order_id" integer NOT NULL,
  	"experienced_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ratings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"brand_id" integer NOT NULL,
  	"wine_id" integer NOT NULL,
  	"cellar_entry_id" integer,
  	"score" numeric NOT NULL,
  	"would_drink_again" boolean,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "taste_signals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"brand_id" integer NOT NULL,
  	"category" "enum_taste_signals_category" NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"score" numeric NOT NULL,
  	"observations" numeric NOT NULL,
  	"calculated_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "journal_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"hero_id" integer,
  	"author_name" varchar,
  	"published_at" timestamp(3) with time zone,
  	"status" "enum_journal_posts_status" DEFAULT 'draft' NOT NULL,
  	"publish_at" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"eyebrow" varchar,
  	"introduction" varchar,
  	"body" jsonb NOT NULL,
  	"status" "enum_pages_status" DEFAULT 'draft' NOT NULL,
  	"publish_at" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gifts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"brand_id" integer NOT NULL,
  	"customer_id" integer,
  	"plan_id" integer NOT NULL,
  	"purchaser_email" varchar NOT NULL,
  	"recipient_name" varchar NOT NULL,
  	"recipient_email" varchar NOT NULL,
  	"message" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"status" "enum_gifts_status" DEFAULT 'draft' NOT NULL,
  	"provider_checkout_id" varchar,
  	"redemption_token_hash" varchar,
  	"redeemed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "promotions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"provider_promotion_code_id" varchar,
  	"active" boolean DEFAULT true,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"usage_limit" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_shipping_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"country_code" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL,
  	"site_name" varchar NOT NULL,
  	"site_url" varchar NOT NULL,
  	"default_title" varchar NOT NULL,
  	"default_description" varchar NOT NULL,
  	"support_email" varchar NOT NULL,
  	"age_gate_enabled" boolean DEFAULT true,
  	"minimum_age" numeric DEFAULT 18 NOT NULL,
  	"terms_reviewed_at" timestamp(3) with time zone,
  	"privacy_reviewed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "webhook_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider" "enum_webhook_events_provider" NOT NULL,
  	"provider_event_id" varchar NOT NULL,
  	"event_type" varchar NOT NULL,
  	"livemode" boolean DEFAULT false NOT NULL,
  	"status" "enum_webhook_events_status" DEFAULT 'processing' NOT NULL,
  	"received_at" timestamp(3) with time zone NOT NULL,
  	"processed_at" timestamp(3) with time zone,
  	"attempts" numeric DEFAULT 1 NOT NULL,
  	"error_code" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer,
  	"plans_id" integer,
  	"wines_id" integer,
  	"wine_skus_id" integer,
  	"producers_id" integer,
  	"countries_id" integer,
  	"regions_id" integer,
  	"grapes_id" integer,
  	"editions_id" integer,
  	"boxes_id" integer,
  	"inventory_movements_id" integer,
  	"customers_id" integer,
  	"addresses_id" integer,
  	"subscriptions_id" integer,
  	"orders_id" integer,
  	"order_items_id" integer,
  	"cellar_entries_id" integer,
  	"ratings_id" integer,
  	"taste_signals_id" integer,
  	"journal_posts_id" integer,
  	"pages_id" integer,
  	"gifts_id" integer,
  	"promotions_id" integer,
  	"site_settings_id" integer,
  	"webhook_events_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"customers_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "brands_hostnames" ADD CONSTRAINT "brands_hostnames_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plans" ADD CONSTRAINT "plans_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_label_id_media_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines_rels" ADD CONSTRAINT "wines_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wines_rels" ADD CONSTRAINT "wines_rels_grapes_fk" FOREIGN KEY ("grapes_id") REFERENCES "public"."grapes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_skus" ADD CONSTRAINT "wine_skus_wine_id_wines_id_fk" FOREIGN KEY ("wine_id") REFERENCES "public"."wines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wine_skus" ADD CONSTRAINT "wine_skus_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "producers" ADD CONSTRAINT "producers_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "producers" ADD CONSTRAINT "producers_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "producers" ADD CONSTRAINT "producers_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "producers_rels" ADD CONSTRAINT "producers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."producers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "producers_rels" ADD CONSTRAINT "producers_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "regions" ADD CONSTRAINT "regions_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "grapes_aliases" ADD CONSTRAINT "grapes_aliases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."grapes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "editions_story_chapters" ADD CONSTRAINT "editions_story_chapters_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editions_story_chapters" ADD CONSTRAINT "editions_story_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "editions" ADD CONSTRAINT "editions_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editions" ADD CONSTRAINT "editions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editions" ADD CONSTRAINT "editions_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editions_rels" ADD CONSTRAINT "editions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "editions_rels" ADD CONSTRAINT "editions_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "editions_rels" ADD CONSTRAINT "editions_rels_wine_skus_fk" FOREIGN KEY ("wine_skus_id") REFERENCES "public"."wine_skus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boxes" ADD CONSTRAINT "boxes_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "boxes" ADD CONSTRAINT "boxes_edition_id_editions_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."editions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "boxes" ADD CONSTRAINT "boxes_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "boxes_rels" ADD CONSTRAINT "boxes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boxes_rels" ADD CONSTRAINT "boxes_rels_wine_skus_fk" FOREIGN KEY ("wine_skus_id") REFERENCES "public"."wine_skus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_sku_id_wine_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."wine_skus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "addresses" ADD CONSTRAINT "addresses_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "addresses" ADD CONSTRAINT "addresses_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_edition_id_editions_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."editions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_box_id_boxes_id_fk" FOREIGN KEY ("box_id") REFERENCES "public"."boxes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_addresses_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_wine_s_k_u_id_wine_skus_id_fk" FOREIGN KEY ("wine_s_k_u_id") REFERENCES "public"."wine_skus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cellar_entries" ADD CONSTRAINT "cellar_entries_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cellar_entries" ADD CONSTRAINT "cellar_entries_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cellar_entries" ADD CONSTRAINT "cellar_entries_wine_id_wines_id_fk" FOREIGN KEY ("wine_id") REFERENCES "public"."wines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cellar_entries" ADD CONSTRAINT "cellar_entries_wine_s_k_u_id_wine_skus_id_fk" FOREIGN KEY ("wine_s_k_u_id") REFERENCES "public"."wine_skus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cellar_entries" ADD CONSTRAINT "cellar_entries_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ratings" ADD CONSTRAINT "ratings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ratings" ADD CONSTRAINT "ratings_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ratings" ADD CONSTRAINT "ratings_wine_id_wines_id_fk" FOREIGN KEY ("wine_id") REFERENCES "public"."wines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ratings" ADD CONSTRAINT "ratings_cellar_entry_id_cellar_entries_id_fk" FOREIGN KEY ("cellar_entry_id") REFERENCES "public"."cellar_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "taste_signals" ADD CONSTRAINT "taste_signals_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "taste_signals" ADD CONSTRAINT "taste_signals_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts" ADD CONSTRAINT "journal_posts_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts" ADD CONSTRAINT "journal_posts_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts" ADD CONSTRAINT "journal_posts_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gifts" ADD CONSTRAINT "gifts_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gifts" ADD CONSTRAINT "gifts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gifts" ADD CONSTRAINT "gifts_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promotions" ADD CONSTRAINT "promotions_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_shipping_countries" ADD CONSTRAINT "site_settings_shipping_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wines_fk" FOREIGN KEY ("wines_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wine_skus_fk" FOREIGN KEY ("wine_skus_id") REFERENCES "public"."wine_skus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_producers_fk" FOREIGN KEY ("producers_id") REFERENCES "public"."producers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grapes_fk" FOREIGN KEY ("grapes_id") REFERENCES "public"."grapes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_editions_fk" FOREIGN KEY ("editions_id") REFERENCES "public"."editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_boxes_fk" FOREIGN KEY ("boxes_id") REFERENCES "public"."boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inventory_movements_fk" FOREIGN KEY ("inventory_movements_id") REFERENCES "public"."inventory_movements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_addresses_fk" FOREIGN KEY ("addresses_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscriptions_fk" FOREIGN KEY ("subscriptions_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_order_items_fk" FOREIGN KEY ("order_items_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cellar_entries_fk" FOREIGN KEY ("cellar_entries_id") REFERENCES "public"."cellar_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ratings_fk" FOREIGN KEY ("ratings_id") REFERENCES "public"."ratings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_taste_signals_fk" FOREIGN KEY ("taste_signals_id") REFERENCES "public"."taste_signals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journal_posts_fk" FOREIGN KEY ("journal_posts_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gifts_fk" FOREIGN KEY ("gifts_id") REFERENCES "public"."gifts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promotions_fk" FOREIGN KEY ("promotions_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_settings_fk" FOREIGN KEY ("site_settings_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_webhook_events_fk" FOREIGN KEY ("webhook_events_id") REFERENCES "public"."webhook_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "brands_hostnames_order_idx" ON "brands_hostnames" USING btree ("_order");
  CREATE INDEX "brands_hostnames_parent_id_idx" ON "brands_hostnames" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_active_idx" ON "brands" USING btree ("active");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "plans_brand_idx" ON "plans" USING btree ("brand_id");
  CREATE UNIQUE INDEX "plans_code_idx" ON "plans" USING btree ("code");
  CREATE INDEX "plans_updated_at_idx" ON "plans" USING btree ("updated_at");
  CREATE INDEX "plans_created_at_idx" ON "plans" USING btree ("created_at");
  CREATE INDEX "wines_brand_idx" ON "wines" USING btree ("brand_id");
  CREATE UNIQUE INDEX "wines_slug_idx" ON "wines" USING btree ("slug");
  CREATE INDEX "wines_status_idx" ON "wines" USING btree ("status");
  CREATE INDEX "wines_producer_idx" ON "wines" USING btree ("producer_id");
  CREATE INDEX "wines_country_idx" ON "wines" USING btree ("country_id");
  CREATE INDEX "wines_region_idx" ON "wines" USING btree ("region_id");
  CREATE INDEX "wines_label_idx" ON "wines" USING btree ("label_id");
  CREATE INDEX "wines_updated_at_idx" ON "wines" USING btree ("updated_at");
  CREATE INDEX "wines_created_at_idx" ON "wines" USING btree ("created_at");
  CREATE INDEX "wines_rels_order_idx" ON "wines_rels" USING btree ("order");
  CREATE INDEX "wines_rels_parent_idx" ON "wines_rels" USING btree ("parent_id");
  CREATE INDEX "wines_rels_path_idx" ON "wines_rels" USING btree ("path");
  CREATE INDEX "wines_rels_grapes_id_idx" ON "wines_rels" USING btree ("grapes_id");
  CREATE INDEX "wine_skus_wine_idx" ON "wine_skus" USING btree ("wine_id");
  CREATE INDEX "wine_skus_brand_idx" ON "wine_skus" USING btree ("brand_id");
  CREATE UNIQUE INDEX "wine_skus_sku_idx" ON "wine_skus" USING btree ("sku");
  CREATE INDEX "wine_skus_updated_at_idx" ON "wine_skus" USING btree ("updated_at");
  CREATE INDEX "wine_skus_created_at_idx" ON "wine_skus" USING btree ("created_at");
  CREATE UNIQUE INDEX "producers_slug_idx" ON "producers" USING btree ("slug");
  CREATE INDEX "producers_status_idx" ON "producers" USING btree ("status");
  CREATE INDEX "producers_country_idx" ON "producers" USING btree ("country_id");
  CREATE INDEX "producers_region_idx" ON "producers" USING btree ("region_id");
  CREATE INDEX "producers_portrait_idx" ON "producers" USING btree ("portrait_id");
  CREATE INDEX "producers_updated_at_idx" ON "producers" USING btree ("updated_at");
  CREATE INDEX "producers_created_at_idx" ON "producers" USING btree ("created_at");
  CREATE INDEX "producers_rels_order_idx" ON "producers_rels" USING btree ("order");
  CREATE INDEX "producers_rels_parent_idx" ON "producers_rels" USING btree ("parent_id");
  CREATE INDEX "producers_rels_path_idx" ON "producers_rels" USING btree ("path");
  CREATE INDEX "producers_rels_brands_id_idx" ON "producers_rels" USING btree ("brands_id");
  CREATE UNIQUE INDEX "countries_code_idx" ON "countries" USING btree ("code");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE UNIQUE INDEX "regions_slug_idx" ON "regions" USING btree ("slug");
  CREATE INDEX "regions_status_idx" ON "regions" USING btree ("status");
  CREATE INDEX "regions_country_idx" ON "regions" USING btree ("country_id");
  CREATE INDEX "regions_hero_idx" ON "regions" USING btree ("hero_id");
  CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
  CREATE INDEX "grapes_aliases_order_idx" ON "grapes_aliases" USING btree ("_order");
  CREATE INDEX "grapes_aliases_parent_id_idx" ON "grapes_aliases" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "grapes_name_idx" ON "grapes" USING btree ("name");
  CREATE INDEX "grapes_updated_at_idx" ON "grapes" USING btree ("updated_at");
  CREATE INDEX "grapes_created_at_idx" ON "grapes" USING btree ("created_at");
  CREATE INDEX "editions_story_chapters_order_idx" ON "editions_story_chapters" USING btree ("_order");
  CREATE INDEX "editions_story_chapters_parent_id_idx" ON "editions_story_chapters" USING btree ("_parent_id");
  CREATE INDEX "editions_story_chapters_media_idx" ON "editions_story_chapters" USING btree ("media_id");
  CREATE INDEX "editions_brand_idx" ON "editions" USING btree ("brand_id");
  CREATE UNIQUE INDEX "editions_code_idx" ON "editions" USING btree ("code");
  CREATE UNIQUE INDEX "editions_slug_idx" ON "editions" USING btree ("slug");
  CREATE INDEX "editions_status_idx" ON "editions" USING btree ("status");
  CREATE INDEX "editions_period_start_idx" ON "editions" USING btree ("period_start");
  CREATE INDEX "editions_publish_at_idx" ON "editions" USING btree ("publish_at");
  CREATE INDEX "editions_region_idx" ON "editions" USING btree ("region_id");
  CREATE INDEX "editions_hero_idx" ON "editions" USING btree ("hero_id");
  CREATE INDEX "editions_updated_at_idx" ON "editions" USING btree ("updated_at");
  CREATE INDEX "editions_created_at_idx" ON "editions" USING btree ("created_at");
  CREATE INDEX "editions_rels_order_idx" ON "editions_rels" USING btree ("order");
  CREATE INDEX "editions_rels_parent_idx" ON "editions_rels" USING btree ("parent_id");
  CREATE INDEX "editions_rels_path_idx" ON "editions_rels" USING btree ("path");
  CREATE INDEX "editions_rels_plans_id_idx" ON "editions_rels" USING btree ("plans_id");
  CREATE INDEX "editions_rels_wine_skus_id_idx" ON "editions_rels" USING btree ("wine_skus_id");
  CREATE INDEX "boxes_brand_idx" ON "boxes" USING btree ("brand_id");
  CREATE INDEX "boxes_edition_idx" ON "boxes" USING btree ("edition_id");
  CREATE INDEX "boxes_plan_idx" ON "boxes" USING btree ("plan_id");
  CREATE UNIQUE INDEX "boxes_code_idx" ON "boxes" USING btree ("code");
  CREATE INDEX "boxes_status_idx" ON "boxes" USING btree ("status");
  CREATE INDEX "boxes_updated_at_idx" ON "boxes" USING btree ("updated_at");
  CREATE INDEX "boxes_created_at_idx" ON "boxes" USING btree ("created_at");
  CREATE INDEX "boxes_rels_order_idx" ON "boxes_rels" USING btree ("order");
  CREATE INDEX "boxes_rels_parent_idx" ON "boxes_rels" USING btree ("parent_id");
  CREATE INDEX "boxes_rels_path_idx" ON "boxes_rels" USING btree ("path");
  CREATE INDEX "boxes_rels_wine_skus_id_idx" ON "boxes_rels" USING btree ("wine_skus_id");
  CREATE UNIQUE INDEX "inventory_movements_reference_idx" ON "inventory_movements" USING btree ("reference");
  CREATE INDEX "inventory_movements_brand_idx" ON "inventory_movements" USING btree ("brand_id");
  CREATE INDEX "inventory_movements_sku_idx" ON "inventory_movements" USING btree ("sku_id");
  CREATE INDEX "inventory_movements_order_idx" ON "inventory_movements" USING btree ("order_id");
  CREATE INDEX "inventory_movements_updated_at_idx" ON "inventory_movements" USING btree ("updated_at");
  CREATE INDEX "inventory_movements_created_at_idx" ON "inventory_movements" USING btree ("created_at");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE INDEX "customers_brand_idx" ON "customers" USING btree ("brand_id");
  CREATE INDEX "customers_status_idx" ON "customers" USING btree ("status");
  CREATE UNIQUE INDEX "customers_external_customer_id_idx" ON "customers" USING btree ("external_customer_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "addresses_customer_idx" ON "addresses" USING btree ("customer_id");
  CREATE INDEX "addresses_brand_idx" ON "addresses" USING btree ("brand_id");
  CREATE INDEX "addresses_updated_at_idx" ON "addresses" USING btree ("updated_at");
  CREATE INDEX "addresses_created_at_idx" ON "addresses" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscriptions_code_idx" ON "subscriptions" USING btree ("code");
  CREATE INDEX "subscriptions_brand_idx" ON "subscriptions" USING btree ("brand_id");
  CREATE INDEX "subscriptions_customer_idx" ON "subscriptions" USING btree ("customer_id");
  CREATE INDEX "subscriptions_plan_idx" ON "subscriptions" USING btree ("plan_id");
  CREATE INDEX "subscriptions_status_idx" ON "subscriptions" USING btree ("status");
  CREATE INDEX "subscriptions_current_period_end_idx" ON "subscriptions" USING btree ("current_period_end");
  CREATE UNIQUE INDEX "subscriptions_provider_subscription_id_idx" ON "subscriptions" USING btree ("provider_subscription_id");
  CREATE INDEX "subscriptions_provider_customer_id_idx" ON "subscriptions" USING btree ("provider_customer_id");
  CREATE INDEX "subscriptions_updated_at_idx" ON "subscriptions" USING btree ("updated_at");
  CREATE INDEX "subscriptions_created_at_idx" ON "subscriptions" USING btree ("created_at");
  CREATE UNIQUE INDEX "orders_code_idx" ON "orders" USING btree ("code");
  CREATE INDEX "orders_brand_idx" ON "orders" USING btree ("brand_id");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_subscription_idx" ON "orders" USING btree ("subscription_id");
  CREATE INDEX "orders_edition_idx" ON "orders" USING btree ("edition_id");
  CREATE INDEX "orders_box_idx" ON "orders" USING btree ("box_id");
  CREATE INDEX "orders_shipping_address_idx" ON "orders" USING btree ("shipping_address_id");
  CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");
  CREATE UNIQUE INDEX "orders_provider_checkout_id_idx" ON "orders" USING btree ("provider_checkout_id");
  CREATE UNIQUE INDEX "orders_provider_invoice_id_idx" ON "orders" USING btree ("provider_invoice_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");
  CREATE INDEX "order_items_customer_idx" ON "order_items" USING btree ("customer_id");
  CREATE INDEX "order_items_brand_idx" ON "order_items" USING btree ("brand_id");
  CREATE INDEX "order_items_wine_s_k_u_idx" ON "order_items" USING btree ("wine_s_k_u_id");
  CREATE INDEX "order_items_updated_at_idx" ON "order_items" USING btree ("updated_at");
  CREATE INDEX "order_items_created_at_idx" ON "order_items" USING btree ("created_at");
  CREATE INDEX "cellar_entries_customer_idx" ON "cellar_entries" USING btree ("customer_id");
  CREATE INDEX "cellar_entries_brand_idx" ON "cellar_entries" USING btree ("brand_id");
  CREATE INDEX "cellar_entries_wine_idx" ON "cellar_entries" USING btree ("wine_id");
  CREATE INDEX "cellar_entries_wine_s_k_u_idx" ON "cellar_entries" USING btree ("wine_s_k_u_id");
  CREATE INDEX "cellar_entries_order_idx" ON "cellar_entries" USING btree ("order_id");
  CREATE INDEX "cellar_entries_experienced_at_idx" ON "cellar_entries" USING btree ("experienced_at");
  CREATE INDEX "cellar_entries_updated_at_idx" ON "cellar_entries" USING btree ("updated_at");
  CREATE INDEX "cellar_entries_created_at_idx" ON "cellar_entries" USING btree ("created_at");
  CREATE INDEX "ratings_customer_idx" ON "ratings" USING btree ("customer_id");
  CREATE INDEX "ratings_brand_idx" ON "ratings" USING btree ("brand_id");
  CREATE INDEX "ratings_wine_idx" ON "ratings" USING btree ("wine_id");
  CREATE INDEX "ratings_cellar_entry_idx" ON "ratings" USING btree ("cellar_entry_id");
  CREATE INDEX "ratings_updated_at_idx" ON "ratings" USING btree ("updated_at");
  CREATE INDEX "ratings_created_at_idx" ON "ratings" USING btree ("created_at");
  CREATE INDEX "taste_signals_customer_idx" ON "taste_signals" USING btree ("customer_id");
  CREATE INDEX "taste_signals_brand_idx" ON "taste_signals" USING btree ("brand_id");
  CREATE INDEX "taste_signals_key_idx" ON "taste_signals" USING btree ("key");
  CREATE INDEX "taste_signals_updated_at_idx" ON "taste_signals" USING btree ("updated_at");
  CREATE INDEX "taste_signals_created_at_idx" ON "taste_signals" USING btree ("created_at");
  CREATE INDEX "journal_posts_brand_idx" ON "journal_posts" USING btree ("brand_id");
  CREATE UNIQUE INDEX "journal_posts_slug_idx" ON "journal_posts" USING btree ("slug");
  CREATE INDEX "journal_posts_hero_idx" ON "journal_posts" USING btree ("hero_id");
  CREATE INDEX "journal_posts_published_at_idx" ON "journal_posts" USING btree ("published_at");
  CREATE INDEX "journal_posts_status_idx" ON "journal_posts" USING btree ("status");
  CREATE INDEX "journal_posts_publish_at_idx" ON "journal_posts" USING btree ("publish_at");
  CREATE INDEX "journal_posts_seo_seo_image_idx" ON "journal_posts" USING btree ("seo_image_id");
  CREATE INDEX "journal_posts_updated_at_idx" ON "journal_posts" USING btree ("updated_at");
  CREATE INDEX "journal_posts_created_at_idx" ON "journal_posts" USING btree ("created_at");
  CREATE INDEX "pages_brand_idx" ON "pages" USING btree ("brand_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_status_idx" ON "pages" USING btree ("status");
  CREATE INDEX "pages_publish_at_idx" ON "pages" USING btree ("publish_at");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "gifts_code_idx" ON "gifts" USING btree ("code");
  CREATE INDEX "gifts_brand_idx" ON "gifts" USING btree ("brand_id");
  CREATE INDEX "gifts_customer_idx" ON "gifts" USING btree ("customer_id");
  CREATE INDEX "gifts_plan_idx" ON "gifts" USING btree ("plan_id");
  CREATE INDEX "gifts_purchaser_email_idx" ON "gifts" USING btree ("purchaser_email");
  CREATE INDEX "gifts_status_idx" ON "gifts" USING btree ("status");
  CREATE UNIQUE INDEX "gifts_provider_checkout_id_idx" ON "gifts" USING btree ("provider_checkout_id");
  CREATE INDEX "gifts_redemption_token_hash_idx" ON "gifts" USING btree ("redemption_token_hash");
  CREATE INDEX "gifts_updated_at_idx" ON "gifts" USING btree ("updated_at");
  CREATE INDEX "gifts_created_at_idx" ON "gifts" USING btree ("created_at");
  CREATE INDEX "promotions_brand_idx" ON "promotions" USING btree ("brand_id");
  CREATE UNIQUE INDEX "promotions_code_idx" ON "promotions" USING btree ("code");
  CREATE UNIQUE INDEX "promotions_provider_promotion_code_id_idx" ON "promotions" USING btree ("provider_promotion_code_id");
  CREATE INDEX "promotions_active_idx" ON "promotions" USING btree ("active");
  CREATE INDEX "promotions_updated_at_idx" ON "promotions" USING btree ("updated_at");
  CREATE INDEX "promotions_created_at_idx" ON "promotions" USING btree ("created_at");
  CREATE INDEX "site_settings_shipping_countries_order_idx" ON "site_settings_shipping_countries" USING btree ("_order");
  CREATE INDEX "site_settings_shipping_countries_parent_id_idx" ON "site_settings_shipping_countries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_brand_idx" ON "site_settings" USING btree ("brand_id");
  CREATE INDEX "site_settings_updated_at_idx" ON "site_settings" USING btree ("updated_at");
  CREATE INDEX "site_settings_created_at_idx" ON "site_settings" USING btree ("created_at");
  CREATE UNIQUE INDEX "webhook_events_provider_event_id_idx" ON "webhook_events" USING btree ("provider_event_id");
  CREATE INDEX "webhook_events_event_type_idx" ON "webhook_events" USING btree ("event_type");
  CREATE INDEX "webhook_events_status_idx" ON "webhook_events" USING btree ("status");
  CREATE INDEX "webhook_events_updated_at_idx" ON "webhook_events" USING btree ("updated_at");
  CREATE INDEX "webhook_events_created_at_idx" ON "webhook_events" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("plans_id");
  CREATE INDEX "payload_locked_documents_rels_wines_id_idx" ON "payload_locked_documents_rels" USING btree ("wines_id");
  CREATE INDEX "payload_locked_documents_rels_wine_skus_id_idx" ON "payload_locked_documents_rels" USING btree ("wine_skus_id");
  CREATE INDEX "payload_locked_documents_rels_producers_id_idx" ON "payload_locked_documents_rels" USING btree ("producers_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");
  CREATE INDEX "payload_locked_documents_rels_grapes_id_idx" ON "payload_locked_documents_rels" USING btree ("grapes_id");
  CREATE INDEX "payload_locked_documents_rels_editions_id_idx" ON "payload_locked_documents_rels" USING btree ("editions_id");
  CREATE INDEX "payload_locked_documents_rels_boxes_id_idx" ON "payload_locked_documents_rels" USING btree ("boxes_id");
  CREATE INDEX "payload_locked_documents_rels_inventory_movements_id_idx" ON "payload_locked_documents_rels" USING btree ("inventory_movements_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_addresses_id_idx" ON "payload_locked_documents_rels" USING btree ("addresses_id");
  CREATE INDEX "payload_locked_documents_rels_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("subscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_order_items_id_idx" ON "payload_locked_documents_rels" USING btree ("order_items_id");
  CREATE INDEX "payload_locked_documents_rels_cellar_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("cellar_entries_id");
  CREATE INDEX "payload_locked_documents_rels_ratings_id_idx" ON "payload_locked_documents_rels" USING btree ("ratings_id");
  CREATE INDEX "payload_locked_documents_rels_taste_signals_id_idx" ON "payload_locked_documents_rels" USING btree ("taste_signals_id");
  CREATE INDEX "payload_locked_documents_rels_journal_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("journal_posts_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_gifts_id_idx" ON "payload_locked_documents_rels" USING btree ("gifts_id");
  CREATE INDEX "payload_locked_documents_rels_promotions_id_idx" ON "payload_locked_documents_rels" USING btree ("promotions_id");
  CREATE INDEX "payload_locked_documents_rels_site_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("site_settings_id");
  CREATE INDEX "payload_locked_documents_rels_webhook_events_id_idx" ON "payload_locked_documents_rels" USING btree ("webhook_events_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "brands_hostnames" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "plans" CASCADE;
  DROP TABLE "wines" CASCADE;
  DROP TABLE "wines_rels" CASCADE;
  DROP TABLE "wine_skus" CASCADE;
  DROP TABLE "producers" CASCADE;
  DROP TABLE "producers_rels" CASCADE;
  DROP TABLE "countries" CASCADE;
  DROP TABLE "regions" CASCADE;
  DROP TABLE "grapes_aliases" CASCADE;
  DROP TABLE "grapes" CASCADE;
  DROP TABLE "editions_story_chapters" CASCADE;
  DROP TABLE "editions" CASCADE;
  DROP TABLE "editions_rels" CASCADE;
  DROP TABLE "boxes" CASCADE;
  DROP TABLE "boxes_rels" CASCADE;
  DROP TABLE "inventory_movements" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "addresses" CASCADE;
  DROP TABLE "subscriptions" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "order_items" CASCADE;
  DROP TABLE "cellar_entries" CASCADE;
  DROP TABLE "ratings" CASCADE;
  DROP TABLE "taste_signals" CASCADE;
  DROP TABLE "journal_posts" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "gifts" CASCADE;
  DROP TABLE "promotions" CASCADE;
  DROP TABLE "site_settings_shipping_countries" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "webhook_events" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_brands_currency";
  DROP TYPE "public"."enum_plans_cadence";
  DROP TYPE "public"."enum_plans_currency";
  DROP TYPE "public"."enum_wines_status";
  DROP TYPE "public"."enum_wines_style";
  DROP TYPE "public"."enum_wine_skus_currency";
  DROP TYPE "public"."enum_producers_status";
  DROP TYPE "public"."enum_regions_status";
  DROP TYPE "public"."enum_grapes_colour";
  DROP TYPE "public"."enum_editions_status";
  DROP TYPE "public"."enum_boxes_status";
  DROP TYPE "public"."enum_inventory_movements_reason";
  DROP TYPE "public"."enum_customers_status";
  DROP TYPE "public"."enum_subscriptions_status";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_currency";
  DROP TYPE "public"."enum_order_items_currency";
  DROP TYPE "public"."enum_taste_signals_category";
  DROP TYPE "public"."enum_journal_posts_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum_gifts_status";
  DROP TYPE "public"."enum_webhook_events_provider";
  DROP TYPE "public"."enum_webhook_events_status";
  DROP TYPE "public"."enum_users_role";`)
}
