import { db } from "@/db"
import { appointments } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { and, eq, gte, lte, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export async function getAverageTicket(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/establishments/average-ticket",
      {
        schema: {
          tags: ["Dashboard"],
          summary: "Obter ticket médio (valor médio por agendamento)",
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
            totalRevenue: sql<string>`COALESCE(SUM(${appointments.paymentAmount}), 0)`,
            totalAppointments: sql<string>`COUNT(*)`,
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

        const totalRevenue = Number.parseFloat(result[0]?.totalRevenue || "0")
        const totalAppointments = Number.parseInt(
          result[0]?.totalAppointments || "0"
        )

        const averageTicket =
          totalAppointments > 0 ? totalRevenue / totalAppointments : 0

        const averageTicketInCents = Math.round(averageTicket * 100)

        return reply.send({ value: averageTicketInCents })
      }
    )
}
