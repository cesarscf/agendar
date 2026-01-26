-- Limpar dados órfãos antes de criar as constraints
DELETE FROM "subscriptions" WHERE "partner_id" NOT IN (SELECT "id" FROM "partners");
--> statement-breakpoint
DELETE FROM "partner_payment_methods" WHERE "partner_id" NOT IN (SELECT "id" FROM "partners");
--> statement-breakpoint
DELETE FROM "customer_service_packages" WHERE "customer_id" NOT IN (SELECT "id" FROM "customers");
--> statement-breakpoint
DELETE FROM "customer_service_packages" WHERE "service_package_id" NOT IN (SELECT "id" FROM "packages");
--> statement-breakpoint
DELETE FROM "customer_service_package_usages" WHERE "appointment_id" IS NOT NULL AND "appointment_id" NOT IN (SELECT "id" FROM "appointments");
--> statement-breakpoint
ALTER TABLE "customer_service_packages" DROP CONSTRAINT IF EXISTS "customer_service_packages_customer_id_customers_id_fk";
--> statement-breakpoint
ALTER TABLE "customer_service_packages" DROP CONSTRAINT IF EXISTS "customer_service_packages_service_package_id_packages_id_fk";
--> statement-breakpoint
ALTER TABLE "customer_service_package_usages" DROP CONSTRAINT IF EXISTS "customer_service_package_usages_appointment_id_appointments_id_fk";
--> statement-breakpoint
ALTER TABLE "customer_service_package_usages" DROP CONSTRAINT IF EXISTS "customer_service_package_usages_appointment_id_appointments_id_";
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "subscriptions_partner_id_partners_id_fk";
--> statement-breakpoint
ALTER TABLE "partner_payment_methods" DROP CONSTRAINT IF EXISTS "partner_payment_methods_partner_id_partners_id_fk";
--> statement-breakpoint
ALTER TABLE "customer_service_packages" ADD CONSTRAINT "customer_service_packages_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_service_packages" ADD CONSTRAINT "customer_service_packages_service_package_id_packages_id_fk" FOREIGN KEY ("service_package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_service_package_usages" ADD CONSTRAINT "customer_service_package_usages_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_payment_methods" ADD CONSTRAINT "partner_payment_methods_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;