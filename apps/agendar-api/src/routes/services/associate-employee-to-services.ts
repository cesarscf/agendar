import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { employeeServices } from "@/db/schema/employee-services"
import { auth } from "@/middlewares/auth"
import { commissionToDb } from "@/utils/commission"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"

export async function associateEmployeesToService(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)

    typedApp.post(
      "/services/:serviceId/employees",
      {
        schema: {
          tags: ["Service"],
          summary: "Associate employees to a service",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          params: z.object({
            serviceId: z.string().uuid(),
          }),
          body: z.object({
            employees: z.array(
              z.object({
                id: z.string().uuid(),
                commission: z.string({
                  message: "Commission must be a string like '25' = 25%",
                }),
              })
            ),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { serviceId } = request.params
        const { employees } = request.body

        await db
          .delete(employeeServices)
          .where(eq(employeeServices.serviceId, serviceId))

        if (employees.length > 0) {
          await db.insert(employeeServices).values(
            employees.map(employee => ({
              serviceId,
              employeeId: employee.id,
              commission: commissionToDb(employee.commission),
              active: true,
            }))
          )
        }

        return reply.status(204).send()
      }
    )
  })
}
