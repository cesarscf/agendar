import { desc } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"

export async function listPartners(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/partners",
    {
      schema: {
        tags: ["Admin"],
        summary: "List all partners with subscriptions",
        response: {
          200: z.object({
            partners: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                email: z.string(),
                state: z.string().nullable(),
                city: z.string().nullable(),
                createdAt: z.date(),
                subscription: z
                  .object({
                    id: z.string().uuid(),
                    status: z.string(),
                    currentPeriodEnd: z.date(),
                    cancelAtPeriodEnd: z.boolean().nullable(),
                    plan: z.object({
                      id: z.string().uuid(),
                      name: z.string(),
                      price: z.string(),
                    }),
                  })
                  .nullable(),
                establishmentsCount: z.number(),
              })
            ),
          }),
        },
      },
    },
    async (_request, reply) => {
      const partnersData = await db.query.partners.findMany({
        orderBy: partners => desc(partners.createdAt),
        with: {
          subscriptions: {
            with: {
              plan: true,
            },
          },
          establishments: true,
        },
      })

      const partners = partnersData.map(partner => ({
        id: partner.id,
        name: partner.name,
        email: partner.email,
        state: partner.state,
        city: partner.city,
        createdAt: partner.createdAt,
        subscription: partner.subscriptions[0]
          ? {
              id: partner.subscriptions[0].id,
              status: partner.subscriptions[0].status,
              currentPeriodEnd: partner.subscriptions[0].currentPeriodEnd,
              cancelAtPeriodEnd: partner.subscriptions[0].cancelAtPeriodEnd,
              plan: {
                id: partner.subscriptions[0].plan.id,
                name: partner.subscriptions[0].plan.name,
                price: partner.subscriptions[0].plan.price,
              },
            }
          : null,
        establishmentsCount: partner.establishments.length,
      }))

      return reply.send({ partners })
    }
  )
}
