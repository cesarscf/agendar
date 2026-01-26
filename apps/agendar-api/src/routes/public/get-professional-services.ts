import { db } from "@/db"
import { employeeServices, establishments, services } from "@/db/schema"
import { reaisToCents } from "@/utils/price"
import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export async function getProfessionalServices(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:slug/professionals/:employeeId/services",
    {
      schema: {
        tags: ["Public"],
        summary: "Listar serviços que o profissional realiza",
        params: z.object({
          slug: z.string(),
          employeeId: z.string().uuid(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string().nullable(),
              price: z.string(),
              durationInMinutes: z.number(),
              image: z.string().nullable(),
            })
          ),
        },
      },
    },
    async (req, reply) => {
      const { slug, employeeId } = req.params
      const est = await db.query.establishments.findFirst({
        where: eq(establishments.slug, slug),
        columns: { id: true },
      })

      if (!est) return reply.status(404).send()

      const result = await db
        .select({
          id: services.id,
          name: services.name,
          description: services.description,
          price: services.price,
          durationInMinutes: services.durationInMinutes,
          image: services.image,
        })
        .from(employeeServices)
        .innerJoin(services, eq(services.id, employeeServices.serviceId))
        .where(
          and(
            eq(employeeServices.employeeId, employeeId),
            eq(services.establishmentId, est.id)
          )
        )

      const data = result.map(it => ({
        ...it,
        price: reaisToCents(it.price),
      }))

      return reply.send(data)
    }
  )
}
