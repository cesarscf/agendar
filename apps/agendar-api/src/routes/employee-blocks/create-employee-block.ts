import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { employees, employeeTimeBlocks } from "@/db/schema" // importando employees
import { auth } from "@/middlewares/auth"

export async function createEmployeeBlock(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.post(
      "/employees/:id/blocks",
      {
        schema: {
          security: [{ bearerAuth: [] }],
          tags: ["Employee Blocks"],
          summary: "Create time block for employee",
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            startsAt: z.coerce.date(),
            endsAt: z.coerce.date(),
            reason: z.string().optional(),
          }),
          response: {
            201: z.object({ id: z.string().uuid() }),
            400: z.object({ message: z.string() }),
            403: z.object({ message: z.string() }),
          },
        },
      },
      async (request, reply) => {
        const { id: employeeId } = request.params
        const { startsAt, endsAt, reason } = request.body
        const { establishmentId } = await request.getCurrentEstablishmentId()

        if (startsAt >= endsAt) {
          return reply
            .status(400)
            .send({ message: "startsAt must be before endsAt" })
        }

        const employee = await db.query.employees.findFirst({
          where: eq(employees.id, employeeId),
        })

        if (!employee || employee.establishmentId !== establishmentId) {
          return reply.status(403).send({ message: "Unauthorized" })
        }

        const [block] = await db
          .insert(employeeTimeBlocks)
          .values({
            employeeId,
            startsAt,
            endsAt,
            reason,
          })
          .returning({ id: employeeTimeBlocks.id })

        return reply.status(201).send({ id: block.id })
      }
    )
  })
}
