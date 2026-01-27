import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { stripe } from "@/clients/stripe"
import { db } from "@/db"
import { partners, plans } from "@/db/schema"
import { env } from "@/env"
import { auth } from "@/middlewares/auth"
import { BadRequestError } from "@/routes/_erros/bad-request-error"

export async function createCheckoutSession(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)

    typedApp.post(
      "/subscriptions/checkout-session",
      {
        schema: {
          tags: ["Subscriptions"],
          summary: "Create Stripe Checkout Session for subscription",
          security: [{ bearerAuth: [] }],
          body: z.object({
            planId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              url: z.string(),
            }),
            400: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const partnerId = await request.getCurrentPartnerId()
        const { planId } = request.body

        const [partner] = await db
          .select()
          .from(partners)
          .where(eq(partners.id, partnerId))

        if (!partner) {
          throw new BadRequestError("Partner not found")
        }

        const [plan] = await db.select().from(plans).where(eq(plans.id, planId))

        if (!plan) {
          throw new BadRequestError("Plan not found")
        }

        if (plan.status !== "active") {
          throw new BadRequestError("Plan is not available")
        }

        const session = await stripe.checkout.sessions.create({
          customer: partner.integrationPaymentId,
          mode: "subscription",
          line_items: [
            {
              price: plan.integrationPriceId,
              quantity: 1,
            },
          ],
          success_url: `${env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.FRONTEND_URL}/checkout/cancel`,
          subscription_data: {
            trial_period_days: plan.trialPeriodDays || undefined,
            metadata: {
              partnerId,
              planId,
            },
          },
          metadata: {
            partnerId,
            planId,
          },
        })

        if (!session.url) {
          throw new BadRequestError("Failed to create checkout session")
        }

        return reply.send({ url: session.url })
      }
    )
  })
}
