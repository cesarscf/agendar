import { db } from "@/db"
import { employees, establishments } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export async function getEstablishmentProfessionalById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:slug/professionals/:id",
    {
      schema: {
        tags: ["Public"],
        summary: "Buscar profissional da loja pelo ID",
        params: z.object({ slug: z.string(), id: z.string() }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            avatarUrl: z.string().nullable(),
            biography: z.string().nullable(),
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

      const result = await db.query.employees.findFirst({
        where: and(eq(employees.establishmentId, est.id), eq(employees.id, id)),
        columns: {
          id: true,
          name: true,
          avatarUrl: true,
          biography: true,
        },
      })

      return reply.send(result)
    }
  )
}
