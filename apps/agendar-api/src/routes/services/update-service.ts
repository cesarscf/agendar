import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { serviceCategories, services } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { centsToReais } from "@/utils/price"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"
import { updateServiceSchema } from "@/utils/schemas/services"
import { BadRequestError } from "../_erros/bad-request-error"

export async function updateService(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.put(
      "/services/:id",
      {
        schema: {
          tags: ["Service"],
          summary: "Update service",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          params: z.object({
            id: z.string().uuid(),
          }),
          body: updateServiceSchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const { id: serviceId } = request.params
        const { categoryIds, ...serviceData } = request.body

        const serviceExists = await db.query.services.findFirst({
          where: and(
            eq(services.establishmentId, establishmentId),
            eq(services.id, serviceId)
          ),
          columns: {
            id: true,
          },
        })

        if (!serviceExists) {
          throw new BadRequestError("Service not found")
        }

        const updateData: Record<string, unknown> = { ...serviceData }
        if (serviceData.price) {
          updateData.price = centsToReais(serviceData.price)
        }

        await db
          .update(services)
          .set(updateData)
          .where(
            and(
              eq(services.id, serviceId),
              eq(services.establishmentId, establishmentId)
            )
          )

        if (categoryIds !== undefined) {
          await db
            .delete(serviceCategories)
            .where(eq(serviceCategories.serviceId, serviceId))

          if (categoryIds.length > 0) {
            await db.insert(serviceCategories).values(
              categoryIds.map(categoryId => ({
                serviceId,
                categoryId,
              }))
            )
          }
        }

        return reply.status(204).send()
      }
    )
  })
}
