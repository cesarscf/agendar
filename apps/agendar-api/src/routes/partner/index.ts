import { createPartner } from "@/routes/partner/create-partner"
import { getPartner } from "@/routes/partner/get-partner"
import { login } from "@/routes/partner/login"

import { createPrePartner } from "@/routes/partner/create-pre-partner"
import type { FastifyInstance } from "fastify"

export async function partnerRoutes(app: FastifyInstance) {
  await createPartner(app)
  await login(app)
  await getPartner(app)
  await createPrePartner(app)
}
