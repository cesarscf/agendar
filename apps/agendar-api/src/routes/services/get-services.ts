import { db } from "@/db"
import { services } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { reaisToCents } from "@/utils/price"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"
import { serviceSchema } from "@/utils/schemas/services"
import { asc, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export async function getServices(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.get(
      "/services",
      {
        schema: {
          tags: ["Service"],
          summary: "Get establishment services",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          response: {
            201: z.array(serviceSchema),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const result = await db.query.services.findMany({
          where: eq(services.establishmentId, establishmentId),
          columns: {
            id: true,
            name: true,
            active: true,
            description: true,
            durationInMinutes: true,
            image: true,
            price: true,
          },
          with: {
            categories: {
              with: {
                category: {
                  columns: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: asc(services.name),
        })

        const data = result.map(it => ({
          ...it,
          price: reaisToCents(it.price),
          categories: it.categories.map(sc => sc.category),
        }))

        return reply.status(201).send(data)
      }
    )
  })
}
