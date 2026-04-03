import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { employees, establishments } from "@/db/schema"
import { employeeAuth } from "@/middlewares/employee-auth"

export async function getEmployeeProfile(
  app: FastifyInstance
) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(employeeAuth)
    .get(
      "/employee/me",
      {
        schema: {
          tags: ["Employee Self"],
          summary: "Get authenticated employee profile",
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              employee: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string().nullable(),
                phone: z.string().nullable(),
                avatarUrl: z.string().nullable(),
                biography: z.string().nullable(),
              }),
              establishment: z.object({
                id: z.string(),
                name: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { employeeId, establishmentId } =
          await request.getCurrentEmployeeEstablishmentId()

        const employee =
          await db.query.employees.findFirst({
            where: eq(employees.id, employeeId),
          })

        const establishment =
          await db.query.establishments.findFirst({
            where: eq(establishments.id, establishmentId),
          })

        if (!employee || !establishment) {
          throw new Error("Employee or establishment not found")
        }

        return reply.send({
          employee: {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            avatarUrl: employee.avatarUrl,
            biography: employee.biography,
          },
          establishment: {
            id: establishment.id,
            name: establishment.name,
          },
        })
      }
    )
}
