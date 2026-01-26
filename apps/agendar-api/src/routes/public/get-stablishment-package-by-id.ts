import { and, eq, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { establishments, packageItems, packages } from "@/db/schema"
import { reaisToCents } from "@/utils/price"

export async function getEstablishmentPackageById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:slug/packages/:id",
    {
      schema: {
        tags: ["Public"],
        summary: "Obter pacote de serviços pelo ID",
        params: z.object({ id: z.string(), slug: z.string() }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            price: z.string(),
            image: z.string().nullable(),
            totalServices: z.number(),
            serviceId: z.string().nullable(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { id, slug } = req.params

      const est = await db.query.establishments.findFirst({
        where: eq(establishments.slug, slug),
        columns: { id: true },
      })

      if (!est) return reply.status(404).send()

      // Buscar o pacote
      const [pkg] = await db
        .select({
          id: packages.id,
          name: packages.name,
          description: packages.description,
          price: packages.price,
          image: packages.image,
          totalServices: sql<number>`COUNT(${packageItems.id})`.mapWith(Number),
        })
        .from(packages)
        .leftJoin(packageItems, eq(packageItems.packageId, packages.id))
        .where(and(eq(packages.id, id), eq(packages.establishmentId, est.id)))
        .groupBy(packages.id)
        .limit(1)

      if (!pkg) return reply.status(404).send()

      const [item] = await db
        .select({
          serviceId: packageItems.serviceId,
        })
        .from(packageItems)
        .where(eq(packageItems.packageId, id))
        .limit(1)

      const result = {
        ...pkg,
        serviceId: item?.serviceId ?? null,
        price: reaisToCents(pkg.price),
      }

      return reply.send(result)
    }
  )
}
