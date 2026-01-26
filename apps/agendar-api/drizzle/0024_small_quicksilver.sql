ALTER TABLE "appointments" RENAME COLUMN "package_id" TO "customer_service_package_id";--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_package_id_customer_service_packages_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_service_package_id_customer_service_packages_id_fk" FOREIGN KEY ("customer_service_package_id") REFERENCES "public"."customer_service_packages"("id") ON DELETE no action ON UPDATE no action;