import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { employees } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { requireActiveSubscription } from "@/middlewares/require-active-subscription"
import { commissionToFront } from "@/utils/commission"
import { employeeSchema } from "@/utils/schemas/employees"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"
import { BadRequestError } from "../_erros/bad-request-error"

export async function getEmployee(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.register(requireActiveSubscription)
    typedApp.get(
      "/employees/:id",
      {
        schema: {
          tags: ["Employee"],
          summary: "Get establishment employee by id",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            201: employeeSchema.extend({
              services: z.array(
                z.object({
                  serviceId: z.string(),
                  commission: z.string(),
                  active: z.boolean(),
                  serviceName: z.string(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()
        const { id: employeeId } = request.params

        const employee = await db.query.employees.findFirst({
          where: and(
            eq(employees.establishmentId, establishmentId),
            eq(employees.id, employeeId)
          ),
          columns: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            address: true,
            active: true,
            avatarUrl: true,
            phone: true,
            biography: true,
          },
          with: {
            employeeServices: {
              columns: {
                id: true,
                commission: true,
                active: true,
              },
              with: {
                service: {
                  columns: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        })

        if (!employee) {
          throw new BadRequestError("Employee not found")
        }

        const services = employee.employeeServices.map(es => ({
          serviceId: es.service.id,
          commission: commissionToFront(es.commission),
          active: es.active,
          serviceName: es.service.name,
        }))

        return reply.status(201).send({
          ...employee,
          services,
        })
      }
    )
  })
}
