import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { stripe } from "@/clients/stripe"
import { db } from "@/db"
import { partners } from "@/db/schema"
import { env } from "@/env"
import { auth } from "@/middlewares/auth"
import { BadRequestError } from "@/routes/_erros/bad-request-error"

export async function createCustomerPortal(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)

    typedApp.post(
      "/subscriptions/customer-portal",
      {
        schema: {
          tags: ["Subscriptions"],
          summary: "Create Stripe Customer Portal session",
          security: [{ bearerAuth: [] }],
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

        const [partner] = await db
          .select()
          .from(partners)
          .where(eq(partners.id, partnerId))

        if (!partner) {
          throw new BadRequestError("Partner not found")
        }

        if (!partner.integrationPaymentId) {
          throw new BadRequestError("Partner has no Stripe customer")
        }

        const session = await stripe.billingPortal.sessions.create({
          customer: partner.integrationPaymentId,
          return_url: `${env.FRONTEND_URL}/app/settings`,
          ...(env.STRIPE_PORTAL_CONFIG_ID && {
            configuration: env.STRIPE_PORTAL_CONFIG_ID,
          }),
        })

        return reply.send({ url: session.url })
      }
    )
  })
}
