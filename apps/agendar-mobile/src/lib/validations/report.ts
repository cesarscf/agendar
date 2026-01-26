import { z } from "zod"

export const reportTypes = [
  "totalRevenue",
  "averageTicket",
  "serviceRevenue",
  "packageRevenue",
  "packageRevenueByEmployee",
  "serviceRevenueByEmployee",
  "serviceCount",
  "serviceCountByEmployee",
  "loyalty",
  "newCustomers",
] as const

export const getReportSchema = z.object({
  type: z.enum(reportTypes),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  serviceId: z.string().uuid().optional(),
  employeeId: z.string().uuid().optional(),
})

export type GetReportParams = z.infer<typeof getReportSchema>
