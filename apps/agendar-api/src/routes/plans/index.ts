import type { FastifyInstance } from "fastify"
import { getPlanById } from "@/routes/plans/get-plan-by-id"
import { listActivePlans } from "@/routes/plans/list-active-plans"

export async function planRoutes(app: FastifyInstance) {
  await listActivePlans(app)
  await getPlanById(app)
}
