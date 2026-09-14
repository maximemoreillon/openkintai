CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"sub" text NOT NULL,
	"display_name" text,
	CONSTRAINT "users_sub_unique" UNIQUE("sub")
);
--> statement-breakpoint
DROP TABLE "records" CASCADE;