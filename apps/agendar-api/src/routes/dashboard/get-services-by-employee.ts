import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { appointments, employees } from "@/db/schema"
import { auth } from "@/middlewares/auth"

export async function getServicesByEmployee(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/establishments/services-by-employee",
      {
        schema: {
          tags: ["Dashboard"],
          summary: "Obter quantidade de serviços realizados por profissional",
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
                  totalBookings: z.number(),
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
            totalBookings: sql<string>`COUNT(*)`,
          })
          .from(appointments)
          .innerJoin(employees, eq(appointments.employeeId, employees.id))
          .where(
            and(
              eq(appointments.establishmentId, establishmentId),
              eq(appointments.status, "completed"),
              gte(appointments.date, startDate),
              lte(appointments.date, endDate)
            )
          )
          .groupBy(employees.id, employees.name)
          .orderBy(desc(sql`COUNT(*)`))

        const items = result.map(row => ({
          employee: row.employee || "other",
          totalBookings: Number.parseInt(row.totalBookings, 10),
        }))

        return reply.send({ items })
      }
    )
}
