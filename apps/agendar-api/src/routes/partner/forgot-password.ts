import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { sendEmail } from "@/clients/resend"
import { db } from "@/db"
import { partners, verifications } from "@/db/schema"
import { resetPasswordTemplate } from "@/utils/reset-password-template"

export async function forgotPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/forgot-password",
    {
      schema: {
        tags: ["Partner"],
        summary: "Forgot password",
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body
      const normalizedEmail = email.toLowerCase()

      const genericMessage =
        "Se o e-mail existir, você receberá as instruções em breve."

      const partner = await db.query.partners.findFirst({
        where: eq(partners.email, normalizedEmail),
      })

      if (!partner) {
        return reply.status(201).send({ message: genericMessage })
      }

      await db
        .delete(verifications)
        .where(eq(verifications.identifier, normalizedEmail))

      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

      await db.insert(verifications).values({
        identifier: normalizedEmail,
        value: token,
        expiresAt,
      })

      const html = resetPasswordTemplate(token, partner.name)

      await sendEmail([normalizedEmail], "Redefinição de senha — Agendar", html)

      return reply.status(201).send({ message: genericMessage })
    }
  )
}
