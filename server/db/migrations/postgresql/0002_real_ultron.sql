CREATE TABLE "records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"time" timestamp DEFAULT now() NOT NULL,
	"action" text NOT NULL
);
