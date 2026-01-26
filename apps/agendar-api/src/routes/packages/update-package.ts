import { db } from "@/db"
import { packages } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { commissionToDb, commissionToFront } from "@/utils/commission"
import { centsToReais, reaisToCents } from "@/utils/price"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"
import { packageSchema } from "@/utils/schemas/packages"
import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { BadRequestError } from "../_erros/bad-request-error"

export async function updatePackage(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.put(
      "/packages/:id",
      {
        schema: {
          tags: ["Package"],
          summary: "Update package",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            name: z.string().optional(),
            active: z.boolean().optional(),
            commission: z
              .string({ message: "Price must be a number 1000 = 10.00" })
              .optional(),
            price: z
              .string({ message: "Price must be a number 1000 = 10.00" })
              .optional(),
            image: z.string().optional(),
          }),
          response: {
            204: packageSchema,
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const { id: packageId } = request.params
        const data = request.body

        const packageExists = await db.query.packages.findFirst({
          where: and(
            eq(packages.establishmentId, establishmentId),
            eq(packages.id, packageId)
          ),
          columns: {
            id: true,
          },
        })

        if (!packageExists) {
          throw new BadRequestError("Package not found")
        }

        const formatedData = data

        if (formatedData.commission !== undefined) {
          formatedData.commission = commissionToDb(formatedData.commission)
        }

        if (formatedData.price !== undefined) {
          formatedData.price = centsToReais(formatedData.price)
        }

        const [updatedPackage] = await db
          .update(packages)
          .set({
            ...formatedData,
          })
          .where(
            and(
              eq(packages.id, packageId),
              eq(packages.establishmentId, establishmentId)
            )
          )
          .returning({
            id: packages.id,
            name: packages.name,
            active: packages.active,
            commission: packages.commission,
            description: packages.description,
            image: packages.image,
            price: packages.price,
          })

        if (!updatedPackage) {
          throw new BadRequestError("Failed to update package")
        }

        return reply.status(204).send({
          ...updatedPackage,
          price: reaisToCents(updatedPackage.price),
          commission: commissionToFront(updatedPackage.commission),
        })
      }
    )
  })
}
