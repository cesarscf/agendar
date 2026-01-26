import type { FastifyInstance } from "fastify"
import { createPartner } from "@/routes/partner/create-partner"
import { createPrePartner } from "@/routes/partner/create-pre-partner"
import { getPartner } from "@/routes/partner/get-partner"
import { login } from "@/routes/partner/login"

export async function partnerRoutes(app: FastifyInstance) {
  await createPartner(app)
  await login(app)
  await getPartner(app)
  await createPrePartner(app)
}
