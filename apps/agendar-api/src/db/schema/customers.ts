import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core"
import { establishments } from "@/db/schema/establishments"

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    establishmentId: uuid("establishment_id")
      .notNull()
      .references(() => establishments.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    birthDate: timestamp("birth_date", { mode: "date" }).notNull(),
    phoneNumber: text("phone_number").notNull(),
    cpf: text("cpf"),
    email: text("email"),
    state: text("state"),
    city: text("city"),
    address: text("address"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  table => ({
    uniquePhonePerEstablishment: unique("unique_phone_per_establishment").on(
      table.establishmentId,
      table.phoneNumber
    ),
  })
)

export type Customers = typeof customers.$inferSelect
export type NewCustomers = typeof customers.$inferInsert
