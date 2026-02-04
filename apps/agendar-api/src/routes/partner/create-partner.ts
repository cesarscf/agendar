import bcrypt from "bcrypt"
import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { stripe } from "@/clients/stripe"
import { db } from "@/db"
import {
  establishments,
  partners,
  plans,
  prePartners,
  subscriptions,
} from "@/db/schema"
import { BadRequestError } from "@/routes/_erros/bad-request-error"
import { generateRandomString } from "@/utils/generate-random-string"
import { slugify } from "@/utils/slug"

export async function createPartner(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        tags: ["Partner"],
        summary: "Register",
        body: z.object({
          code: z.string(),
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
          state: z.string().optional(),
          city: z.string().optional(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password, name, state, city } = request.body

      const formatedEmail = email.toLowerCase()
      const { code } = request.body
      const existingPrePartner = await db.query.prePartners.findFirst({
        where: and(
          eq(prePartners.email, formatedEmail),
          eq(prePartners.code, code)
        ),
      })

      if (!existingPrePartner) {
        throw new BadRequestError("Código inválido")
      }
      if (existingPrePartner.status === "confirmed") {
        throw new BadRequestError("Este usuário já está registrado")
      }
      if (new Date() > existingPrePartner.codeExpireAt) {
        throw new BadRequestError("Código expirado")
      }
      const existingPartner = await db.query.partners.findFirst({
        where: eq(partners.email, formatedEmail),
      })

      if (existingPartner) {
        throw new BadRequestError("Este usuário já está registrado")
      }

      const customerPayment = await stripe.customers.create({
        email: formatedEmail,
        name: name,
      })

      const hashedPassword = await bcrypt.hash(password, 1)

      const [newPartner] = await db
        .insert(partners)
        .values({
          integrationPaymentId: customerPayment.id,
          name,
          password: hashedPassword,
          email: formatedEmail,
          state,
          city,
        })
        .returning()

      const randomString = generateRandomString(4)

      const establishmentName = "Nome da loja"

      try {
        await db
          .insert(establishments)
          .values({
            name: establishmentName,
            slug: `${slugify(establishmentName)}-${randomString}`,
            ownerId: newPartner.id,
          })
          .returning()
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "23505"
        ) {
          throw new BadRequestError(
            "Já existe um estabelecimento com este slug. Tente novamente."
          )
        }
        throw error
      }

      const [trialPlan] = await db
        .select()
        .from(plans)
        .where(and(eq(plans.status, "inactive"), eq(plans.name, "Plano Gratuito")))
        .limit(1)

      if (trialPlan) {
        try {
          const TRIAL_DAYS = 7
          const stripeSubscription = await stripe.subscriptions.create({
            customer: customerPayment.id,
            items: [{ price: trialPlan.integrationPriceId }],
            trial_period_days: TRIAL_DAYS,
            cancel_at_period_end: true,
            expand: [
              "latest_invoice.payment_intent",
              "items.data.price",
              "plan",
            ],
          })

          const now = new Date()
          const trialEnd = new Date(now)
          trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS)

          await db.insert(subscriptions).values({
            partnerId: newPartner.id,
            planId: trialPlan.id,
            integrationSubscriptionId: stripeSubscription.id,
            status: stripeSubscription.status,
            currentPeriodEnd: trialEnd,
          })
        } catch (error) {
          console.error("Erro ao criar subscription trial:", error)
        }
      }

      const token = await reply.jwtSign(
        {
          sub: newPartner.id,
        },
        {
          sign: {
            expiresIn: "7d",
          },
        }
      )

      await db
        .update(prePartners)
        .set({
          status: "confirmed",
        })
        .where(eq(prePartners.email, formatedEmail))

      return reply.status(201).send({ token })
    }
  )
}
