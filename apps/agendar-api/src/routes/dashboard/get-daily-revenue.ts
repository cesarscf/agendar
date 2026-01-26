import { and, eq, gte, lte, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { appointments } from "@/db/schema"
import { auth } from "@/middlewares/auth"

export async function getDailyRevenue(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/establishments/daily-revenue",
      {
        schema: {
          tags: ["Dashboard"],
          summary: "Obter receita diária por período",
          querystring: z.object({
            startDate: z
              .string()
              .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
            endDate: z
              .string()
              .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
          }),
          response: {
            200: z.object({
              items: z.array(
                z.object({
                  date: z.string(),
                  value: z.number(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()
        const { startDate, endDate } = request.query

        if (new Date(endDate) < new Date(startDate)) {
          throw new Error("endDate deve ser maior ou igual a startDate")
        }

        const revenueData = await db
          .select({
            date: appointments.date,
            total: sql<string>`COALESCE(SUM(${appointments.paymentAmount}), 0)`,
          })
          .from(appointments)
          .where(
            and(
              eq(appointments.establishmentId, establishmentId),
              gte(appointments.date, startDate),
              lte(appointments.date, endDate),
              eq(appointments.status, "completed")
            )
          )
          .groupBy(appointments.date)

        const revenueMap = new Map<string, number>()
        for (const row of revenueData) {
          // Convert to cents
          const valueInCents = Math.round(Number.parseFloat(row.total) * 100)
          revenueMap.set(row.date, valueInCents)
        }

        const items: Array<{ date: string; value: number }> = []
        const currentDate = new Date(startDate)
        const endDateTime = new Date(endDate)

        while (currentDate <= endDateTime) {
          const dateStr = currentDate.toISOString().split("T")[0]
          items.push({
            date: dateStr,
            value: revenueMap.get(dateStr) || 0,
          })
          currentDate.setDate(currentDate.getDate() + 1)
        }

        return reply.send({ items })
      }
    )
}
