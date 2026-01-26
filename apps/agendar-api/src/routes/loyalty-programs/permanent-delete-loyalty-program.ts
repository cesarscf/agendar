import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { loyaltyPrograms } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { requireActiveSubscription } from "@/middlewares/require-active-subscription"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"

export async function permanentDeleteLoyaltyProgram(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.register(requireActiveSubscription)
    typedApp.delete(
      "/loyalty-programs/:id/permanent",
      {
        schema: {
          tags: ["Loyalty"],
          summary: "Permanently delete loyalty program and all related data",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          params: z.object({ id: z.string().uuid() }),
          response: { 204: z.null() },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()
        const { id } = request.params

        const program = await db.query.loyaltyPrograms.findFirst({
          where: and(
            eq(loyaltyPrograms.id, id),
            eq(loyaltyPrograms.establishmentId, establishmentId)
          ),
        })

        if (!program) return reply.status(404).send()

        await db.delete(loyaltyPrograms).where(eq(loyaltyPrograms.id, id))

        return reply.status(204).send()
      }
    )
  })
}
