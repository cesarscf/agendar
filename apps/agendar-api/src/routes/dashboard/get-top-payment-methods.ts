import { db } from "@/db"
import { appointments } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export async function getTopPaymentMethods(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/establishments/top-payment-methods",
      {
        schema: {
          tags: ["Dashboard"],
          summary: "Obter os métodos de pagamento mais usados no período",
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
                  method: z.string(),
                  usage: z.number(),
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
            method: appointments.paymentType,
            usage: sql<string>`COUNT(*)`,
          })
          .from(appointments)
          .where(
            and(
              eq(appointments.establishmentId, establishmentId),
              eq(appointments.status, "completed"),
              gte(appointments.date, startDate),
              lte(appointments.date, endDate),
              sql`${appointments.paymentType} IS NOT NULL`
            )
          )
          .groupBy(appointments.paymentType)
          .orderBy(desc(sql`COUNT(*)`))

        const items = result.map(row => ({
          method: row.method || "other",
          usage: Number.parseInt(row.usage),
        }))

        return reply.send({ items })
      }
    )
}
