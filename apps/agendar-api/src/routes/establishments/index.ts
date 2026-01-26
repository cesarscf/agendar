import type { FastifyInstance } from "fastify"
import { getEstablishmentInfo } from "@/routes/establishments/get-establishment-info"
import { updateEstablishment } from "@/routes/establishments/update-establishment"

export async function establishmentsRoutes(app: FastifyInstance) {
  await updateEstablishment(app)
  await getEstablishmentInfo(app)
}
