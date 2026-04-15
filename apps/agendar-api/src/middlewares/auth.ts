import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import { fastifyPlugin } from "fastify-plugin"
import { db } from "@/db"
import { employees, establishments } from "@/db/schema"
import { ForbiddenError } from "@/routes/_erros/forbidden-request-error"
import { UnauthorizedError } from "@/routes/_erros/unauthorized-error"

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook("preHandler", async request => {
    request.getCurrentPartnerId = async () => {
      try {
        const { sub, role, establishmentId } = await request.jwtVerify<{
          sub: string
          role?: string
          establishmentId?: string
        }>()

        if (role === "employee") {
          if (!establishmentId) {
            throw new UnauthorizedError("Invalid employee token")
          }

          const establishment = await db.query.establishments.findFirst({
            where: eq(establishments.id, establishmentId),
            columns: { ownerId: true },
          })

          if (!establishment) {
            throw new ForbiddenError("Establishment not found")
          }

          const employee = await db.query.employees.findFirst({
            where: eq(employees.id, sub),
            columns: { id: true },
          })

          if (!employee) {
            throw new UnauthorizedError("Employee not found")
          }

          return establishment.ownerId
        }

        return sub
      } catch (error) {
        if (error instanceof ForbiddenError) throw error
        if (error instanceof UnauthorizedError) throw error
        throw new UnauthorizedError("Invalid token")
      }
    }

    request.getCurrentEstablishmentId = async () => {
      const partnerId = await request.getCurrentPartnerId()
      const establishmentId = request.headers["x-establishment-id"] as string

      if (establishmentId) {
        const establishment = await db.query.establishments.findFirst({
          where: and(
            eq(establishments.id, establishmentId),
            eq(establishments.ownerId, partnerId)
          ),
        })
        if (!establishment) {
          throw new ForbiddenError("You do not have access to this resource")
        }

        return { establishmentId: establishment.id, partnerId }
      }
      const establishment = await db.query.establishments.findFirst({
        where: and(eq(establishments.ownerId, partnerId)),
      })
      if (!establishment) {
        throw new ForbiddenError("You do not have access to this resource")
      }
      return { establishmentId: establishment.id, partnerId }
    }
  })
})
