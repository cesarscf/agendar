import type { FastifyInstance } from "fastify"
import { getDailyRevenue } from "@/routes/dashboard/get-daily-revenue"
import { getNetRevenue } from "@/routes/dashboard/get-net-revenue"
import { listAppointments } from "@/routes/dashboard/list-appointments"
import { getAppointmentsMetrics } from "./get-appointments-metrics"
import { getAverageTicket } from "./get-average-ticket"
import { getEmployeeCommission } from "./get-employee-commission"
import { getEmployeeRevenue } from "./get-employee-revenue"
import { getMonthlyServices } from "./get-monthly-services"
import { getMostBookedServices } from "./get-most-booked-services"
import { getServicesByEmployee } from "./get-services-by-employee"
import { getTopPaymentMethods } from "./get-top-payment-methods"
import { getTopServices } from "./get-top-services"

export async function dashboardRoutes(app: FastifyInstance) {
  await listAppointments(app)
  await getDailyRevenue(app)
  await getNetRevenue(app)
  await getAverageTicket(app)
  await getAppointmentsMetrics(app)
  await getTopPaymentMethods(app)
  await getTopServices(app)
  await getMostBookedServices(app)
  await getServicesByEmployee(app)
  await getEmployeeRevenue(app)
  await getEmployeeCommission(app)
  await getMonthlyServices(app)
}
