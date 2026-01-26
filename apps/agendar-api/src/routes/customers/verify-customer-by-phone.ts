import { db } from "@/db"
import { customerServicePackages, customers, establishments } from "@/db/schema"
import { customerSchema } from "@/utils/schemas/customers"
import { and, eq, gt, isNull, or } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { BadRequestError } from "../_erros/bad-request-error"

export async function verifyCustomerByPhone(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/customers/verify",
    {
      schema: {
        tags: ["Customer"],
        summary: "Check if customer exists by phone",
        querystring: z.object({
          phone: z.string().min(8),
          slug: z.string(),
          packageId: z.string().optional(),
        }),
        response: {
          200: customerSchema.extend({
            hasPackageAvailable: z.boolean(),
          }),
          404: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { phone, slug, packageId } = request.query

      const establishment = await db.query.establishments.findFirst({
        where: eq(establishments.slug, slug),
      })

      if (!establishment) throw new BadRequestError("Establishment not found")

      const customer = await db.query.customers.findFirst({
        where: and(
          eq(customers.phoneNumber, phone),
          eq(customers.establishmentId, establishment.id)
        ),
        columns: {
          id: true,
          name: true,
          phoneNumber: true,
          address: true,
          birthDate: true,
          city: true,
          cpf: true,
          email: true,
          notes: true,
          state: true,
        },
      })

      if (!customer) {
        return reply.status(404).send(null)
      }

      // Verificar se o cliente possui pacotes disponíveis
      const packageConditions = [
        eq(customerServicePackages.customerId, customer.id),
        eq(customerServicePackages.paid, true),
        gt(customerServicePackages.remainingSessions, 0),
        or(
          isNull(customerServicePackages.expiresAt),
          gt(customerServicePackages.expiresAt, new Date())
        ),
      ]

      // Se packageId for fornecido, verificar apenas esse pacote específico
      if (packageId) {
        packageConditions.push(
          eq(customerServicePackages.servicePackageId, packageId)
        )
      }

      const activePackages = await db.query.customerServicePackages.findMany({
        where: and(...packageConditions),
        limit: 1,
      })

      const hasPackageAvailable = activePackages.length > 0

      return reply.status(200).send({
        ...customer,
        hasPackageAvailable,
      })
    }
  )
}
