ALTER TABLE "loyalty_point_rules" DROP CONSTRAINT "loyalty_point_rules_service_id_services_id_fk";
--> statement-breakpoint
ALTER TABLE "loyalty_programs" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "loyalty_point_rules" ADD CONSTRAINT "loyalty_point_rules_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;