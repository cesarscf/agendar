import bcrypt from "bcrypt"
import { and, eq, isNotNull } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { employees, partners } from "@/db/schema"
import { UnauthorizedError } from "../_erros/unauthorized-error"

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Login (Partner or Employee)",
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
            role: z.enum(["partner", "employee"]),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body
      const normalizedEmail = email.toLowerCase()

      const existingPartner = await db.query.partners.findFirst({
        where: eq(partners.email, normalizedEmail),
      })

      if (existingPartner) {
        const isPasswordValid = await bcrypt.compare(
          password,
          existingPartner.password
        )

        if (!isPasswordValid) {
          throw new UnauthorizedError("Credenciais inválidas")
        }

        const token = await reply.jwtSign(
          { sub: existingPartner.id, role: "partner" },
          { sign: { expiresIn: "7d" } }
        )

        return reply.status(201).send({ token, role: "partner" })
      }

      const existingEmployee = await db.query.employees.findFirst({
        where: and(
          eq(employees.email, normalizedEmail),
          isNotNull(employees.password)
        ),
      })

      if (!existingEmployee?.password) {
        throw new UnauthorizedError("Credenciais inválidas")
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existingEmployee.password
      )

      if (!isPasswordValid) {
        throw new UnauthorizedError("Credenciais inválidas")
      }

      const token = await reply.jwtSign(
        {
          sub: existingEmployee.id,
          role: "employee",
          establishmentId: existingEmployee.establishmentId,
        },
        { sign: { expiresIn: "7d" } }
      )

      return reply
        .status(201)
        .send({ token, role: "employee" })
    }
  )
}
