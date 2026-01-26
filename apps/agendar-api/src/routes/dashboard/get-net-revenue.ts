import { and, eq, gte, lte, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { appointments, employeeServices } from "@/db/schema"
import { auth } from "@/middlewares/auth"

export async function getNetRevenue(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/establishments/net-revenue",
      {
        schema: {
          tags: ["Dashboard"],
          summary: "Obter receita líquida (receita total - comissões)",
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

        const totalRevenueResult = await db
          .select({
            total: sql<string>`COALESCE(SUM(${appointments.paymentAmount}), 0)`,
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

        const totalRevenue = Number.parseFloat(
          totalRevenueResult[0]?.total || "0"
        )

        const commissionsResult = await db
          .select({
            total: sql<string>`COALESCE(SUM(${appointments.paymentAmount} * ${employeeServices.commission}), 0)`,
          })
          .from(appointments)
          .innerJoin(
            employeeServices,
            and(
              eq(appointments.employeeId, employeeServices.employeeId),
              eq(appointments.serviceId, employeeServices.serviceId)
            )
          )
          .where(
            and(
              eq(appointments.establishmentId, establishmentId),
              eq(appointments.status, "completed"),
              gte(appointments.date, startDate),
              lte(appointments.date, endDate)
            )
          )

        const totalCommissions = Number.parseFloat(
          commissionsResult[0]?.total || "0"
        )

        const netRevenue = totalRevenue - totalCommissions

        // Convert to cents
        const netRevenueInCents = Math.round(netRevenue * 100)

        return reply.send({ value: netRevenueInCents })
      }
    )
}
