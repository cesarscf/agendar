ALTER TABLE "customer_service_package_usages" DROP CONSTRAINT "customer_service_package_usages_service_id_services_id_fk";
--> statement-breakpoint
ALTER TABLE "customer_service_package_usages" ADD CONSTRAINT "customer_service_package_usages_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;