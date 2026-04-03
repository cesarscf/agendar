import { and, eq, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { appointments, employeeServices } from "@/db/schema"
import { employeeAuth } from "@/middlewares/employee-auth"

export async function getMyEarnings(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(employeeAuth)
    .get(
      "/employee/earnings",
      {
        schema: {
          tags: ["Employee Self"],
          summary:
            "Get authenticated employee earnings and commission",
          security: [{ bearerAuth: [] }],
          querystring: z.object({
            startDate: z
              .string()
              .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                "Formato deve ser YYYY-MM-DD"
              ),
            endDate: z
              .string()
              .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                "Formato deve ser YYYY-MM-DD"
              ),
          }),
          response: {
            200: z.object({
              revenueInCents: z.number(),
              commissionInCents: z.number(),
              completedAppointments: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { employeeId, establishmentId } =
          await request.getCurrentEmployeeEstablishmentId()
        const { startDate, endDate } = request.query

        const [result] = await db
          .select({
            totalRevenue: sql<string>`COALESCE(SUM(
              CASE
                WHEN ${appointments.status} = 'completed'
                AND ${appointments.date} >= ${startDate}
                AND ${appointments.date} <= ${endDate}
                THEN ${appointments.paymentAmount}
              END
            ), 0)`,
            totalCommission: sql<string>`COALESCE(SUM(
              CASE
                WHEN ${appointments.status} = 'completed'
                AND ${appointments.date} >= ${startDate}
                AND ${appointments.date} <= ${endDate}
                AND ${employeeServices.commission} IS NOT NULL
                THEN ${appointments.paymentAmount} * ${employeeServices.commission}
              END
            ), 0)`,
            completedCount: sql<number>`COUNT(
              CASE
                WHEN ${appointments.status} = 'completed'
                AND ${appointments.date} >= ${startDate}
                AND ${appointments.date} <= ${endDate}
                THEN 1
              END
            )`.mapWith(Number),
          })
          .from(appointments)
          .leftJoin(
            employeeServices,
            and(
              eq(
                employeeServices.employeeId,
                appointments.employeeId
              ),
              eq(
                employeeServices.serviceId,
                appointments.serviceId
              )
            )
          )
          .where(
            and(
              eq(
                appointments.establishmentId,
                establishmentId
              ),
              eq(appointments.employeeId, employeeId)
            )
          )

        return reply.send({
          revenueInCents: Math.round(
            Number.parseFloat(result.totalRevenue) * 100
          ),
          commissionInCents: Math.round(
            Number.parseFloat(result.totalCommission) * 100
          ),
          completedAppointments: result.completedCount,
        })
      }
    )
}
