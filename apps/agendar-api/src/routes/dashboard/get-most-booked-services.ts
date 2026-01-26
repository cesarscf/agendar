import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { appointments, services } from "@/db/schema"
import { auth } from "@/middlewares/auth"

export async function getMostBookedServices(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/establishments/most-booked-services",
      {
        schema: {
          tags: ["Dashboard"],
          summary: "Obter os serviços mais agendados no período",
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
                  service: z.string(),
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
            service: services.name,
            totalBookings: sql<string>`COUNT(*)`,
          })
          .from(appointments)
          .innerJoin(services, eq(appointments.serviceId, services.id))
          .where(
            and(
              eq(appointments.establishmentId, establishmentId),
              eq(appointments.status, "completed"),
              gte(appointments.date, startDate),
              lte(appointments.date, endDate)
            )
          )
          .groupBy(services.id, services.name)
          .orderBy(desc(sql`COUNT(*)`))

        const items = result.map(row => ({
          service: row.service || "other",
          totalBookings: Number.parseInt(row.totalBookings, 10),
        }))

        return reply.send({ items })
      }
    )
}
