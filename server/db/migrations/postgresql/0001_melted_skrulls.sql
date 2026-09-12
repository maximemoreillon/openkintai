ALTER TABLE "shifts" ALTER COLUMN "clockOut" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "shifts" ALTER COLUMN "clockOut" DROP NOT NULL;