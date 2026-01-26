import { asc, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { packages } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { commissionToFront } from "@/utils/commission"
import { reaisToCents } from "@/utils/price"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"
import { packageSchema } from "@/utils/schemas/packages"

export async function getPackages(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.get(
      "/packages",
      {
        schema: {
          tags: ["Package"],
          summary: "Get establishment packages",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          response: {
            201: z.array(packageSchema),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const result = await db.query.packages.findMany({
          where: eq(packages.establishmentId, establishmentId),
          columns: {
            id: true,
            name: true,
            active: true,
            commission: true,
            description: true,
            image: true,
            price: true,
          },
          orderBy: asc(packages.name),
        })

        const formatted = result.map(pkg => ({
          ...pkg,
          price: reaisToCents(pkg.price),
          commission: commissionToFront(pkg.commission),
        }))

        return reply.status(201).send(formatted)
      }
    )
  })
}
