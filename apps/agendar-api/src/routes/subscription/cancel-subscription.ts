import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { stripe } from "@/clients/stripe"
import { db } from "@/db"
import { subscriptions } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { BadRequestError } from "@/routes/_erros/bad-request-error"

export async function cancelSubscription(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)

    typedApp.post(
      "/subscriptions/cancel",
      {
        schema: {
          tags: ["Subscriptions"],
          summary: "Cancel subscription at period end",
          security: [{ bearerAuth: [] }],
          body: z.object({
            immediately: z.boolean().default(false),
          }),
          response: {
            200: z.object({
              cancelAtPeriodEnd: z.boolean(),
              currentPeriodEnd: z.date(),
            }),
            400: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const partnerId = await request.getCurrentPartnerId()
        const { immediately } = request.body

        const [subscription] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.partnerId, partnerId))

        if (!subscription) {
          throw new BadRequestError("No active subscription found")
        }

        if (immediately) {
          // Cancel immediately
          await stripe.subscriptions.cancel(
            subscription.integrationSubscriptionId
          )

          await db
            .update(subscriptions)
            .set({
              status: "canceled",
              endedAt: new Date(),
              cancelAtPeriodEnd: false,
            })
            .where(eq(subscriptions.id, subscription.id))

          return reply.send({
            cancelAtPeriodEnd: false,
            currentPeriodEnd: new Date(),
          })
        }

        // Cancel at period end (default)
        const updated = await stripe.subscriptions.update(
          subscription.integrationSubscriptionId,
          { cancel_at_period_end: true }
        )

        await db
          .update(subscriptions)
          .set({ cancelAtPeriodEnd: true })
          .where(eq(subscriptions.id, subscription.id))

        return reply.send({
          cancelAtPeriodEnd: true,
          currentPeriodEnd: new Date(updated.current_period_end * 1000),
        })
      }
    )
  })
}
