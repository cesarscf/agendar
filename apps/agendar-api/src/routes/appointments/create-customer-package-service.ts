import { and, eq, gt, isNull, or } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "@/db"
import { customerServicePackages, customers, packages } from "@/db/schema"

import { BadRequestError } from "../_erros/bad-request-error"

const createCustomerPackageSchema = z.object({
  customerId: z.string().uuid(),
  packageId: z.string().uuid(),
})

export async function createCustomerPackageService(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()

    typedApp.post(
      "/public/customers/packages",
      {
        schema: {
          tags: ["Public", "Customer", "Package"],
          summary: "Link package to customer (public endpoint)",
          body: createCustomerPackageSchema,
          response: {
            201: z.object({
              id: z.string(),
              customerId: z.string(),
              servicePackageId: z.string(),
              totalSessions: z.number(),
              remainingSessions: z.number(),
              paid: z.boolean(),
              purchasedAt: z.date(),
              expiresAt: z.date().nullable(),
            }),
            400: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { customerId, packageId } = request.body

        const customer = await db.query.customers.findFirst({
          where: eq(customers.id, customerId),
        })

        if (!customer) {
          throw new BadRequestError("Customer not found")
        }

        const packageRecord = await db.query.packages.findFirst({
          where: eq(packages.id, packageId),
          with: {
            packageItems: true,
          },
        })

        if (!packageRecord) {
          throw new BadRequestError("Package not found")
        }

        const existingPackage =
          await db.query.customerServicePackages.findFirst({
            where: and(
              eq(customerServicePackages.customerId, customerId),
              eq(customerServicePackages.servicePackageId, packageId),
              gt(customerServicePackages.remainingSessions, 0),
              or(
                isNull(customerServicePackages.expiresAt),
                gt(customerServicePackages.expiresAt, new Date())
              )
            ),
          })

        if (existingPackage) {
          throw new BadRequestError(
            "Customer already has an active package of this type"
          )
        }

        const totalSessions = packageRecord.packageItems.reduce(
          (total, item) => total + item.quantity,
          0
        )

        const [createdCustomerPackage] = await db
          .insert(customerServicePackages)
          .values({
            customerId,
            servicePackageId: packageId,
            totalSessions,
            remainingSessions: totalSessions,
            paid: false,
          })
          .returning()

        if (!createdCustomerPackage) {
          throw new BadRequestError("Failed to link package to customer")
        }

        return reply.status(201).send(createdCustomerPackage)
      }
    )
  })
}
