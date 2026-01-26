import { db } from "@/db"
import { appointments, employees } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { and, desc, eq, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export async function getEmployeeRevenue(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/establishments/employee-revenue",
      {
        schema: {
          tags: ["Dashboard"],
          summary: "Obter o faturamento bruto por funcionário no período",
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
                  employee: z.string(),
                  revenueInCents: z.number(),
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

        const result = await db
          .select({
            employee: employees.name,
            totalRevenue: sql<string>`COALESCE(SUM(CASE
              WHEN ${appointments.status} = 'completed'
              AND ${appointments.date} >= ${startDate}
              AND ${appointments.date} <= ${endDate}
              THEN ${appointments.paymentAmount}
            END), 0)`,
          })
          .from(employees)
          .leftJoin(
            appointments,
            and(
              eq(appointments.employeeId, employees.id),
              eq(appointments.status, "completed"),
              sql`${appointments.date} >= ${startDate}`,
              sql`${appointments.date} <= ${endDate}`
            )
          )
          .where(eq(employees.establishmentId, establishmentId))
          .groupBy(employees.id, employees.name)
          .orderBy(
            desc(sql`COALESCE(SUM(CASE
            WHEN ${appointments.status} = 'completed'
            AND ${appointments.date} >= ${startDate}
            AND ${appointments.date} <= ${endDate}
            THEN ${appointments.paymentAmount}
          END), 0)`)
          )

        const items = result.map(row => ({
          employee: row.employee,
          revenueInCents: Math.round(Number.parseFloat(row.totalRevenue) * 100),
        }))

        return reply.send({ items })
      }
    )
}
