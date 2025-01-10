CREATE TABLE IF NOT EXISTS "explanations" (
	"id" serial PRIMARY KEY NOT NULL,
	"term" text NOT NULL,
	"responses" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "term_streaks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"term" text NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"github_id" text NOT NULL,
	"username" text NOT NULL,
	"avatar_url" text,
	"access_token" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "term_streaks" ADD CONSTRAINT "term_streaks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
