import bcrypt from "bcrypt"
import { and, eq, isNotNull } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { employees, partners } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { requireActiveSubscription } from "@/middlewares/require-active-subscription"
import { BadRequestError } from "@/routes/_erros/bad-request-error"
import { employeeSchema } from "@/utils/schemas/employees"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"

export async function createEmployee(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.register(requireActiveSubscription)
    typedApp.post(
      "/employees",
      {
        schema: {
          tags: ["Employee"],
          summary: "Create employee",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          body: employeeSchema
            .omit({ id: true })
            .extend({
              email: z.string().email(),
              password: z.string().min(6),
              role: z.enum(["standard", "admin"]).optional(),
            }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } =
          await request.getCurrentEstablishmentId()

        const { password, ...data } = request.body
        const normalizedEmail = data.email.toLowerCase()

        const existingPartner =
          await db.query.partners.findFirst({
            where: eq(partners.email, normalizedEmail),
          })

        if (existingPartner) {
          throw new BadRequestError(
            "Este email já está em uso"
          )
        }

        const existingEmployee =
          await db.query.employees.findFirst({
            where: and(
              eq(employees.email, normalizedEmail),
              isNotNull(employees.password)
            ),
          })

        if (existingEmployee) {
          throw new BadRequestError(
            "Este email já está em uso"
          )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await db.insert(employees).values({
          ...data,
          email: normalizedEmail,
          password: hashedPassword,
          establishmentId,
        })

        return reply.status(204).send()
      }
    )
  })
}
