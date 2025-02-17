ALTER TABLE "users" ADD COLUMN "created_by" uuid DEFAULT id;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "updated_at";