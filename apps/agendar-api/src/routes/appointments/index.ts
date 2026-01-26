import type { FastifyInstance } from "fastify"

import { cancelAppointment } from "@/routes/appointments/cancel-appointment"
import { createAppointment } from "@/routes/appointments/create-appointment"
import { createCustomerPackageService } from "@/routes/appointments/create-customer-package-service"
import { updateAppointmentStatus } from "@/routes/appointments/update-appointment-status"
import { createAppointmentUsingPackage } from "@/routes/appointments/use-package"

export async function appointmentsRoutes(app: FastifyInstance) {
  await createAppointment(app)
  await createAppointmentUsingPackage(app)
  await createCustomerPackageService(app)
  await updateAppointmentStatus(app)
  await cancelAppointment(app)
}
