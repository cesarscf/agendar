import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { lifecycleDates } from "./utils"

export enum prePartnersStatus {
  pending = "pending",
  confirmed = "confirmed",
}

export const prePartners = pgTable("pre_partners", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  code: text("code").notNull().unique(),
  codeExpireAt: timestamp("code_expire_at").notNull(),
  status: text("status").notNull().default("pending"),
  ...lifecycleDates,
})

export type PrePartner = typeof prePartners.$inferSelect
export type NewPrePartner = typeof prePartners.$inferInsert
