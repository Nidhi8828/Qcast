ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_user_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_id_idx";--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_index" ON "user_profiles" USING btree ("email");--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_email_unique" UNIQUE("email");