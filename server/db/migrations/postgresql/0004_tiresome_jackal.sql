ALTER TABLE "users" RENAME COLUMN "display_name" TO "name";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_sub_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_pkey";--> statement-breakpoint
ALTER TABLE "users" ADD PRIMARY KEY ("sub");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "id";