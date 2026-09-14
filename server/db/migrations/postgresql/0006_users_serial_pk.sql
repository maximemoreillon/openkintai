ALTER TABLE "users" DROP CONSTRAINT "users_sub_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_pkey";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "id" serial PRIMARY KEY;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "issuer" text NOT NULL DEFAULT 'keycloak';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "issuer" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_issuer_sub_unique" UNIQUE("issuer","sub");--> statement-breakpoint
ALTER TABLE "shifts" ADD COLUMN "user_id_new" integer;--> statement-breakpoint
UPDATE "shifts" SET "user_id_new" = "users"."id" FROM "users" WHERE "shifts"."user_id" = "users"."sub";--> statement-breakpoint
ALTER TABLE "shifts" ALTER COLUMN "user_id_new" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shifts" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "shifts" RENAME COLUMN "user_id_new" TO "user_id";--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;