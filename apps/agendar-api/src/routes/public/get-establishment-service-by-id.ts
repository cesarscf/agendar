import { db } from "@/db"
import { establishments, services } from "@/db/schema"
import { reaisToCents } from "@/utils/price"
import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
export async function getEstablishmentServiceById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:slug/services/:id",
    {
      schema: {
        tags: ["Public"],
        summary: "Buscar serviço da loja pelo ID",
        params: z.object({ slug: z.string(), id: z.string() }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            price: z.string(),
            durationInMinutes: z.number(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { slug, id } = req.params

      const est = await db.query.establishments.findFirst({
        where: eq(establishments.slug, slug),
        columns: { id: true },
      })

      if (!est) return reply.status(404).send()

      const result = await db.query.services.findFirst({
        where: and(
          eq(services.establishmentId, est.id),
          eq(services.active, true),
          eq(services.id, id)
        ),
        columns: {
          id: true,
          name: true,
          description: true,
          price: true,
          durationInMinutes: true,
        },
      })

      if (!result) return reply.status(404).send()

      const data = {
        ...result,
        price: reaisToCents(result.price),
      }

      return reply.send(data)
    }
  )
}
