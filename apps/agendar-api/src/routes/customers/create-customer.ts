import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { customers } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { customerSchema } from "@/utils/schemas/customers"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"
import { BadRequestError } from "../_erros/bad-request-error"

export async function createCustomer(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.post(
      "/customers",
      {
        schema: {
          tags: ["Customer"],
          summary: "Create customer",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          body: customerSchema.omit({ id: true }),
          response: {
            201: z.object({
              id: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const data = request.body

        const customerWithSamePhone = await db.query.customers.findFirst({
          where: and(
            eq(customers.phoneNumber, data.phoneNumber),
            eq(customers.establishmentId, establishmentId)
          ),
        })

        if (customerWithSamePhone) {
          throw new BadRequestError("Já existe um cliente com esse número.")
        }

        const [createdCustomer] = await db
          .insert(customers)
          .values({
            ...data,
            establishmentId,
          })
          .returning({ id: customers.id })

        return reply.status(201).send(createdCustomer)
      }
    )
  })
}
