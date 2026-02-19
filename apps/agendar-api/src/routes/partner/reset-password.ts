import bcrypt from "bcrypt"
import { and, eq, gt } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { partners, verifications } from "@/db/schema"
import { BadRequestError } from "@/routes/_erros/bad-request-error"

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/reset-password",
    {
      schema: {
        tags: ["Partner"],
        summary: "Reset password",
        body: z.object({
          token: z.string(),
          password: z.string().min(8),
        }),
        response: {
          200: z.object({}),
        },
      },
    },
    async (request, reply) => {
      const { token, password } = request.body

      const verification = await db.query.verifications.findFirst({
        where: and(
          eq(verifications.value, token),
          gt(verifications.expiresAt, new Date())
        ),
      })

      if (!verification) {
        throw new BadRequestError("Token inválido ou expirado.")
      }

      const partner = await db.query.partners.findFirst({
        where: eq(partners.email, verification.identifier),
      })

      if (!partner) {
        throw new BadRequestError("Token inválido ou expirado.")
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await db
        .update(partners)
        .set({ password: hashedPassword })
        .where(eq(partners.id, partner.id))

      await db
        .delete(verifications)
        .where(eq(verifications.id, verification.id))

      return reply.status(200).send({})
    }
  )
}
