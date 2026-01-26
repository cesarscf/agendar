ALTER TABLE "appointments" DROP CONSTRAINT "appointments_package_id_packages_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_package_id_customer_service_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."customer_service_packages"("id") ON DELETE no action ON UPDATE no action;