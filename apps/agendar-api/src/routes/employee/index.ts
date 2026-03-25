import type { FastifyInstance } from "fastify"
import { getEmployeeProfile } from "@/routes/employee/get-profile"
import { getMyAppointments } from "@/routes/employee/get-my-appointments"
import { getMyEarnings } from "@/routes/employee/get-my-earnings"

export async function employeeSelfRoutes(
  app: FastifyInstance
) {
  await getEmployeeProfile(app)
  await getMyAppointments(app)
  await getMyEarnings(app)
}
