import { and, eq, gte, lte, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { appointments } from "@/db/schema"
import { auth } from "@/middlewares/auth"

export async function getMonthlyServices(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/establishments/monthly-services",
      {
        schema: {
          tags: ["Dashboard"],
          summary: "Obter número mensal de serviços ao longo de 12 meses",
          querystring: z.object({
            serviceId: z.string().uuid().optional(),
          }),
          response: {
            200: z.object({
              items: z.array(
                z.object({
                  month: z.string(),
                  value: z.number(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()
        const { serviceId } = request.query

        const currentYear = new Date().getFullYear()
        const startDate = new Date(currentYear, 0, 1) // 1º de janeiro do ano atual
        const endDate = new Date(currentYear, 11, 31) // 31 de dezembro do ano atual

        const startDateStr = startDate.toISOString().split("T")[0]
        const endDateStr = endDate.toISOString().split("T")[0]

        const conditions = [
          eq(appointments.establishmentId, establishmentId),
          eq(appointments.status, "completed"),
          gte(appointments.date, startDateStr),
          lte(appointments.date, endDateStr),
        ]

        if (serviceId) {
          conditions.push(eq(appointments.serviceId, serviceId))
        }

        const result = await db
          .select({
            year: sql<string>`EXTRACT(YEAR FROM ${appointments.date})`,
            month: sql<string>`EXTRACT(MONTH FROM ${appointments.date})`,
            count: sql<string>`COUNT(*)`,
          })
          .from(appointments)
          .where(and(...conditions))
          .groupBy(
            sql`EXTRACT(YEAR FROM ${appointments.date})`,
            sql`EXTRACT(MONTH FROM ${appointments.date})`
          )
          .orderBy(
            sql`EXTRACT(YEAR FROM ${appointments.date})`,
            sql`EXTRACT(MONTH FROM ${appointments.date})`
          )

        const dataMap = new Map<string, number>()
        for (const row of result) {
          const key = `${row.year}-${row.month.padStart(2, "0")}`
          dataMap.set(key, Number.parseInt(row.count, 10))
        }

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]

        const items = []
        const currentDate = new Date(startDate)

        for (let i = 0; i < 12; i++) {
          const year = currentDate.getFullYear()
          const month = currentDate.getMonth() + 1
          const key = `${year}-${month.toString().padStart(2, "0")}`
          const monthName = monthNames[month - 1]

          items.push({
            month: monthName,
            value: dataMap.get(key) || 0,
          })

          currentDate.setMonth(currentDate.getMonth() + 1)
        }

        return reply.send({ items })
      }
    )
}
