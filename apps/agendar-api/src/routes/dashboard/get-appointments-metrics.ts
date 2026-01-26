import { db } from "@/db"
import { appointments } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { and, eq, gte, lte, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export async function getAppointmentsMetrics(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/establishments/appointments-metrics",
      {
        schema: {
          tags: ["Dashboard"],
          summary: "Obter métricas de agendamentos (clientes únicos e total)",
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
              value: z.number(),
              appointmentsCount: z.number(),
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

        const result = await db
          .select({
            uniqueCustomers: sql<string>`COUNT(DISTINCT ${appointments.customerId})`,
            totalAppointments: sql<string>`COUNT(${appointments.id})`,
          })
          .from(appointments)
          .where(
            and(
              eq(appointments.establishmentId, establishmentId),
              eq(appointments.status, "completed"),
              gte(appointments.date, startDate),
              lte(appointments.date, endDate)
            )
          )

        const customersServed = Number.parseInt(
          result[0]?.uniqueCustomers || "0"
        )
        const appointmentsCount = Number.parseInt(
          result[0]?.totalAppointments || "0"
        )

        return reply.send({
          value: customersServed,
          appointmentsCount,
        })
      }
    )
}
