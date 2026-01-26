import { env } from "@/env"

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

export const pg = postgres(env.DATABASE_URL, {
  debug: (_connection, query, parameters) => {
    console.log("[DRIZZLE QUERY]:", query)
    if (parameters?.length) {
      console.log("→ Params:", parameters)
    }
  },
})

export const db = drizzle(pg, { schema })
