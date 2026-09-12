CREATE TABLE "shifts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"clockIn" timestamp DEFAULT now() NOT NULL,
	"clockOut" timestamp DEFAULT now() NOT NULL
);
