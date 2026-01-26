import { db } from "@/db"
import { customers } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { customerSchema } from "@/utils/schemas/customers"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"
import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { BadRequestError } from "../_erros/bad-request-error"

export async function getCustomer(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.get(
      "/customers/:id",
      {
        schema: {
          tags: ["Customer"],
          summary: "Get establishment customer by id",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            201: customerSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const result = await db.query.customers.findFirst({
          where: and(
            eq(customers.establishmentId, establishmentId),
            eq(customers.id, id)
          ),
        })

        if (!result) {
          throw new BadRequestError("Customer not found")
        }

        return reply.status(201).send(result)
      }
    )
  })
}
