ALTER TABLE "loyalty_programs" DROP CONSTRAINT "loyalty_programs_service_reward_id_services_id_fk";
--> statement-breakpoint
ALTER TABLE "loyalty_programs" ADD CONSTRAINT "loyalty_programs_service_reward_id_services_id_fk" FOREIGN KEY ("service_reward_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;