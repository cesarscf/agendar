import type { FastifyInstance } from "fastify"
import { createPartner } from "@/routes/partner/create-partner"
import { createPrePartner } from "@/routes/partner/create-pre-partner"
import { forgotPassword } from "@/routes/partner/forgot-password"
import { getPartner } from "@/routes/partner/get-partner"
import { login } from "@/routes/partner/login"
import { resetPassword } from "@/routes/partner/reset-password"

export async function partnerRoutes(app: FastifyInstance) {
  await createPartner(app)
  await login(app)
  await getPartner(app)
  await createPrePartner(app)
  await forgotPassword(app)
  await resetPassword(app)
}
