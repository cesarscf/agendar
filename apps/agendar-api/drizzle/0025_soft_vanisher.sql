CREATE TABLE "pre_partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "pre_partners_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "employee_time_blocks" ALTER COLUMN "starts_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "employee_time_blocks" ALTER COLUMN "ends_at" SET DATA TYPE timestamp;