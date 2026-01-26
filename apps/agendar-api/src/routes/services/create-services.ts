import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { serviceCategories, services } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { centsToReais } from "@/utils/price"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"
import { createServiceSchema } from "@/utils/schemas/services"

export async function createService(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.post(
      "/services",
      {
        schema: {
          tags: ["Service"],
          summary: "Create services",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          body: createServiceSchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const { categoryIds, ...serviceData } = request.body

        const [service] = await db
          .insert(services)
          .values({
            ...serviceData,
            establishmentId,
            price: centsToReais(serviceData.price),
          })
          .returning({ id: services.id })

        if (categoryIds && categoryIds.length > 0) {
          await db.insert(serviceCategories).values(
            categoryIds.map(categoryId => ({
              serviceId: service.id,
              categoryId,
            }))
          )
        }

        return reply.status(204).send()
      }
    )
  })
}
