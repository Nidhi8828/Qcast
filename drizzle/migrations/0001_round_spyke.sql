DROP TABLE "products";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "modified_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp DEFAULT null;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "modified_by" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_by" uuid DEFAULT null;