CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" text DEFAULT '' NOT NULL,
	"cover_image_key" text,
	"category_id" integer,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"author_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY,
	"site_title" text DEFAULT 'hrafn-Blogg' NOT NULL,
	"site_description" text,
	"theme_preset" text,
	"primary_color" text DEFAULT '#171717' NOT NULL,
	"secondary_color" text DEFAULT '#525252' NOT NULL,
	"accent_color" text DEFAULT '#2563eb' NOT NULL,
	"background_color" text DEFAULT '#ffffff' NOT NULL,
	"text_color" text DEFAULT '#171717' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY,
	"email" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"verification_token" text,
	"verification_token_expires_at" timestamp with time zone,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_idx" ON "admin_users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" ("slug");--> statement-breakpoint
CREATE INDEX "posts_status_published_at_idx" ON "posts" ("status","published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" ("email");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_admin_users_id_fkey" FOREIGN KEY ("author_id") REFERENCES "admin_users"("id");