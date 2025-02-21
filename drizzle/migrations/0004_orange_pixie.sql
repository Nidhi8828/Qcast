CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"date_of_birth" date NOT NULL,
	"location_city" varchar(100) NOT NULL,
	"location_country" varchar(100) NOT NULL,
	"likes" varchar(255) NOT NULL,
	"profile_picture" varchar(255) DEFAULT null,
	"created_at" timestamp DEFAULT now(),
	"modified_at" timestamp DEFAULT now(),
	"deleted_at" timestamp DEFAULT null,
	"created_by" uuid,
	"modified_by" uuid,
	"deleted_by" uuid DEFAULT null,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "user_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "location_idx" ON "user_profiles" USING btree ("location_city","location_country");