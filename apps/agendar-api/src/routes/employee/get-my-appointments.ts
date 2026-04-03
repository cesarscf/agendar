import { and, asc, eq, gte, lte, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import {
  appointmentStatusValues,
  appointments,
  customers,
  services,
} from "@/db/schema"
import { employeeAuth } from "@/middlewares/employee-auth"

const appointmentStatusSchema = z.enum(appointmentStatusValues)

export async function getMyAppointments(
  app: FastifyInstance
) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(employeeAuth)
    .get(
      "/employee/appointments",
      {
        schema: {
          tags: ["Employee Self"],
          summary: "List authenticated employee appointments",
          security: [{ bearerAuth: [] }],
          querystring: z.object({
            page: z.coerce.number().min(1).default(1),
            perPage: z.coerce
              .number()
              .min(1)
              .max(100)
              .default(10),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            status: appointmentStatusSchema.optional(),
          }),
          response: {
            200: z.object({
              appointments: z.array(
                z.object({
                  id: z.string(),
                  startTime: z.string(),
                  endTime: z.string(),
                  status: z.string(),
                  service: z.object({
                    id: z.string(),
                    name: z.string(),
                    servicePrice: z.string(),
                  }),
                  customer: z.object({
                    id: z.string(),
                    name: z.string(),
                    phoneNumber: z.string(),
                  }),
                })
              ),
              total: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { employeeId, establishmentId } =
          await request.getCurrentEmployeeEstablishmentId()
        const { page, perPage, startDate, endDate, status } =
          request.query

        const offset = (page - 1) * perPage

        const filters = [
          eq(appointments.establishmentId, establishmentId),
          eq(appointments.employeeId, employeeId),
          startDate &&
            gte(
              appointments.startTime,
              new Date(startDate)
            ),
          (endDate || startDate) &&
            lte(
              appointments.startTime,
              new Date(
                `${endDate || startDate}T23:59:59`
              )
            ),
          status && eq(appointments.status, status),
        ].filter(Boolean) as Parameters<typeof and>[0][]

        const [data, [{ count }]] = await Promise.all([
          db
            .select({
              id: appointments.id,
              startTime: appointments.startTime,
              endTime: appointments.endTime,
              status: appointments.status,
              service: {
                id: services.id,
                name: services.name,
                servicePrice: services.price,
              },
              customer: {
                id: customers.id,
                name: customers.name,
                phoneNumber: customers.phoneNumber,
              },
            })
            .from(appointments)
            .innerJoin(
              services,
              eq(appointments.serviceId, services.id)
            )
            .innerJoin(
              customers,
              eq(appointments.customerId, customers.id)
            )
            .where(and(...filters))
            .orderBy(asc(appointments.startTime))
            .limit(perPage)
            .offset(offset),
          db
            .select({
              count:
                sql<number>`COUNT(*)`.mapWith(Number),
            })
            .from(appointments)
            .where(and(...filters)),
        ])

        return reply.send({
          appointments: data.map(app => ({
            id: app.id,
            startTime: app.startTime.toISOString(),
            endTime: app.endTime.toISOString(),
            status: app.status,
            service: app.service,
            customer: app.customer,
          })),
          total: count,
        })
      }
    )
}
