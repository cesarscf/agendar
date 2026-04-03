import type { FastifyInstance } from "fastify"
import { fastifyPlugin } from "fastify-plugin"
import { ForbiddenError } from "@/routes/_erros/forbidden-request-error"
import { UnauthorizedError } from "@/routes/_erros/unauthorized-error"

export const employeeAuth = fastifyPlugin(
  async (app: FastifyInstance) => {
    app.addHook("preHandler", async request => {
      request.getCurrentEmployeeId = async () => {
        try {
          const { sub, role } = await request.jwtVerify<{
            sub: string
            role?: string
          }>()

          if (role !== "employee") {
            throw new ForbiddenError(
              "Only employees can access this resource"
            )
          }

          return sub
        } catch (error) {
          if (error instanceof ForbiddenError) throw error
          throw new UnauthorizedError("Invalid token")
        }
      }

      request.getCurrentEmployeeEstablishmentId = async () => {
        try {
          const { sub, role, establishmentId } =
            await request.jwtVerify<{
              sub: string
              role?: string
              establishmentId?: string
            }>()

          if (role !== "employee" || !establishmentId) {
            throw new ForbiddenError(
              "Only employees can access this resource"
            )
          }

          return { employeeId: sub, establishmentId }
        } catch (error) {
          if (error instanceof ForbiddenError) throw error
          throw new UnauthorizedError("Invalid token")
        }
      }
    })
  }
)
