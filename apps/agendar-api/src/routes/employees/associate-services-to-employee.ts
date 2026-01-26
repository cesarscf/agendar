import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "@/db"
import { employeeServices, employees } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { requireActiveSubscription } from "@/middlewares/require-active-subscription"
import { commissionToDb } from "@/utils/commission"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"

const employeeServiceAssociationSchema = z.object({
  serviceId: z.string().uuid(),
  commission: z.string({
    message: "Commission must be a string like '25' = 25%",
  }),
  active: z.boolean().default(true),
})

const associateServicesSchema = z.object({
  services: z.array(employeeServiceAssociationSchema),
})

export async function associateServicesToEmployee(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.register(requireActiveSubscription)
    typedApp.post(
      "/employees/:employeeId/services",
      {
        schema: {
          tags: ["Employee"],
          summary: "Associate services to employee",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          params: z.object({
            employeeId: z.string().uuid(),
          }),
          body: associateServicesSchema,
          response: {
            204: z.null(),
            404: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { employeeId } = request.params
        const { services } = request.body
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const employee = await db.query.employees.findFirst({
          where: and(
            eq(employees.id, employeeId),
            eq(employees.establishmentId, establishmentId)
          ),
        })

        if (!employee) {
          return reply.status(404).send({ message: "Employee not found" })
        }

        await db
          .delete(employeeServices)
          .where(eq(employeeServices.employeeId, employeeId))

        if (services.length > 0) {
          await db.insert(employeeServices).values(
            services.map(service => ({
              employeeId,
              serviceId: service.serviceId,
              commission: commissionToDb(service.commission),
              active: service.active,
            }))
          )
        }

        return reply.status(204).send()
      }
    )
  })
}
