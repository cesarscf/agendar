import { randomInt } from "node:crypto"
import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { sendEmail } from "@/clients/resend"
import { db } from "@/db"
import { prePartners } from "@/db/schema"
import { BadRequestError } from "@/routes/_erros/bad-request-error"
import { sendCodeTemplate } from "@/utils/template-html"

export async function createPrePartner(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/pre-register",
    {
      schema: {
        tags: ["Partner"],
        summary: "Register",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email, name } = request.body

      const formatedEmail = email.toLowerCase()
      const existingPartner = await db.query.prePartners.findFirst({
        where: eq(prePartners.email, formatedEmail),
      })

      if (existingPartner && existingPartner.status === "confirmed") {
        throw new BadRequestError("Este usuário já está registrado")
      }
      const generateCode = randomInt(1000000).toString().padStart(6, "0")
      const generateExpireAtCode = new Date()
      const EXPIRES_IN_MINUTES = 5
      generateExpireAtCode.setMinutes(
        generateExpireAtCode.getMinutes() + EXPIRES_IN_MINUTES
      )
      const body = sendCodeTemplate(generateCode, EXPIRES_IN_MINUTES, name)
      if (existingPartner && existingPartner.status === "pending") {
        await db
          .update(prePartners)
          .set({
            code: generateCode,
            codeExpireAt: generateExpireAtCode,
            name,
          })
          .where(eq(prePartners.email, formatedEmail))
        const result = await sendEmail(
          [formatedEmail],
          "Agendar - Confirme sua conta",
          body
        )
        if (result.error) {
          throw new BadRequestError(result.error.message)
        }

        return reply.status(204).send()
      } else {
        await db
          .insert(prePartners)
          .values({
            email: formatedEmail,
            code: generateCode,
            status: "pending",
            codeExpireAt: generateExpireAtCode,
            name,
          })
          .returning()
        const result = await sendEmail(
          [formatedEmail],
          "Agendar - Confirme sua conta",
          body
        )
        if (result.error) {
          throw new BadRequestError(result.error.message)
        }
        return reply.status(204).send()
      }
    }
  )
}
