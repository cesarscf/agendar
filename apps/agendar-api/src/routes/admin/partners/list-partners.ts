import { count, desc } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import {
  establishments,
  partners as partnersTable,
  plans,
  subscriptions,
} from "@/db/schema"

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
                createdAt: z.coerce.date(),
                subscription: z
                  .object({
                    id: z.string().uuid(),
                    status: z.string(),
                    currentPeriodEnd: z.coerce.date(),
                    cancelAtPeriodEnd: z.boolean(),
                    plan: z
                      .object({
                        id: z.string().uuid(),
                        name: z.string(),
                        price: z.string(),
                      })
                      .nullable(),
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
      // Query 1: Get all partners
      const partnersData = await db
        .select()
        .from(partnersTable)
        .orderBy(desc(partnersTable.createdAt))

      // Query 2: Get all subscriptions with plans
      const subscriptionsData = await db
        .select()
        .from(subscriptions)

      // Query 3: Get all plans
      const plansData = await db.select().from(plans)

      // Query 4: Get establishments count per partner
      const establishmentsCounts = await db
        .select({
          ownerId: establishments.ownerId,
          count: count(),
        })
        .from(establishments)
        .groupBy(establishments.ownerId)

      // Create maps for lookups
      const plansMap = new Map(plansData.map(p => [p.id, p]))
      const subscriptionsMap = new Map(subscriptionsData.map(s => [s.partnerId, s]))
      const countsMap = new Map(
        establishmentsCounts.map(e => [e.ownerId, Number(e.count)])
      )

      const partners = partnersData.map(partner => {
        const sub = subscriptionsMap.get(partner.id)
        const plan = sub ? plansMap.get(sub.planId) : null

        return {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          state: partner.state,
          city: partner.city,
          createdAt: partner.createdAt,
          subscription: sub
            ? {
                id: sub.id,
                status: sub.status,
                currentPeriodEnd: sub.currentPeriodEnd,
                cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
                plan: plan
                  ? {
                      id: plan.id,
                      name: plan.name,
                      price: plan.price,
                    }
                  : null,
              }
            : null,
          establishmentsCount: countsMap.get(partner.id) ?? 0,
        }
      })

      return reply.send({ partners })
    }
  )
}
