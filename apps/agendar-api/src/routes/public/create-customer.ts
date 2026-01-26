import { db } from "@/db"
import { customers, establishments } from "@/db/schema"
import { customerSchema } from "@/utils/schemas/customers"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"

import { and, eq } from "drizzle-orm"
import z from "zod"

export async function createCustomer(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.post(
      "/customers/:slug",
      {
        schema: {
          tags: ["Public"],
          summary: "Create customer",
          params: z.object({ slug: z.string() }),
          body: customerSchema.omit({ id: true }),
          response: {
            200: z.object({
              id: z.string(),
            }),
            201: z.object({
              id: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const establishment = await db.query.establishments.findFirst({
          where: () => eq(establishments.slug, slug),
        })

        console.log(establishment)
        if (!establishment) return reply.status(404).send()

        const data = request.body

        const existingCustomer = await db.query.customers.findFirst({
          where: () =>
            and(
              eq(customers.phoneNumber, data.phoneNumber),
              eq(customers.establishmentId, establishment.id)
            ),
        })

        if (existingCustomer) {
          const [updatedCustomer] = await db
            .update(customers)
            .set({
              ...data,
              establishmentId: establishment.id,
            })
            .where(eq(customers.id, existingCustomer.id))
            .returning({ id: customers.id })

          return reply.status(200).send(updatedCustomer)
        }

        const [createdCustomer] = await db
          .insert(customers)
          .values({
            ...data,
            establishmentId: establishment.id,
          })
          .returning({ id: customers.id })

        return reply.status(201).send(createdCustomer)
      }
    )
  })
}
