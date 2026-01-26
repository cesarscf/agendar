import { db } from "@/db"
import { customerServicePackages, packageItems, packages } from "@/db/schema"
import { customerAuth } from "@/middlewares/customer-auth"
import { customerHeaderSchema } from "@/utils/schemas/headers"
import { and, eq, gt, isNull, or, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { BadRequestError } from "../_erros/bad-request-error"

export async function checkCustomerActivePackage(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(customerAuth)
    typedApp.get(
      "/customers/has-active-package",
      {
        schema: {
          tags: ["Customer"],
          headers: customerHeaderSchema,
          summary: "Check if customer has an active package for a service",
          querystring: z.object({
            serviceId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              purchasedAt: z.string(),
              expiresAt: z.string().nullable(),
              remainingSessions: z.number(),
              totalSessions: z.number(),
              usedSessions: z.number(),
              usagePercentage: z.number(),
              paid: z.boolean(),
            }),
          },
        },
      },
      async (request, reply) => {
        const customerId = await request.getCurrentCustomerId()
        const { serviceId } = request.query

        const result = await db
          .select({
            id: customerServicePackages.id,
            purchasedAt: customerServicePackages.purchasedAt,
            expiresAt: customerServicePackages.expiresAt,
            remainingSessions: customerServicePackages.remainingSessions,
            totalSessions: customerServicePackages.totalSessions,
            paid: customerServicePackages.paid,
          })
          .from(customerServicePackages)
          .innerJoin(
            packages,
            eq(packages.id, customerServicePackages.servicePackageId)
          )
          .innerJoin(packageItems, eq(packageItems.packageId, packages.id))
          .where(
            and(
              eq(customerServicePackages.customerId, customerId),
              eq(packageItems.serviceId, serviceId),
              sql`${customerServicePackages.remainingSessions} > 0`,
              or(
                isNull(customerServicePackages.expiresAt),
                gt(customerServicePackages.expiresAt, new Date())
              )
            )
          )
          .limit(1)

        if (!result.length) {
          throw new BadRequestError("Não encontrado")
        }

        const pkg = result[0]

        console.log(pkg)
        const usedSessions = pkg.totalSessions - pkg.remainingSessions
        const usagePercentage = Math.round(
          (usedSessions / pkg.totalSessions) * 100
        )

        const data = {
          id: pkg.id,
          purchasedAt: pkg.purchasedAt.toISOString(),
          expiresAt: pkg.expiresAt?.toISOString() || null,
          remainingSessions: pkg.remainingSessions,
          totalSessions: pkg.totalSessions,
          usedSessions,
          usagePercentage,
          paid: pkg.paid,
        }

        return reply.send(data)
      }
    )
  })
}
