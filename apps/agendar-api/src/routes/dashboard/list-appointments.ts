// routes/dashboard/list-appointments.ts
import { db } from "@/db"
import {
  appointmentStatusValues,
  appointments,
  customerServicePackages,
  customers,
  employees,
  packages,
  services,
} from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { and, asc, eq, gte, lte, sql } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

const appointmentStatusSchema = z.enum(appointmentStatusValues)

export async function listAppointments(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/establishments/appointments",
      {
        schema: {
          tags: ["Dashboard"],
          summary: "Listar agendamentos com filtros e paginação",
          querystring: z.object({
            page: z.coerce.number().min(1).default(1),
            perPage: z.coerce.number().min(1).max(100).default(10),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            status: appointmentStatusSchema.optional(),
            employeeId: z.string().uuid().optional(),
            serviceId: z.string().uuid().optional(),
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
                  professional: z.object({
                    id: z.string(),
                    name: z.string(),
                  }),
                  customer: z.object({
                    id: z.string(),
                    name: z.string(),
                    phoneNumber: z.string(),
                  }),
                  package: z
                    .object({
                      id: z.string(),
                      name: z.string(),
                      remainingSessions: z.number(),
                      totalSessions: z.number(),
                      description: z.string().nullable(),
                      price: z.string(),
                      paid: z.boolean(),
                    })
                    .nullable(),
                })
              ),
              total: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()
        const {
          page,
          perPage,
          startDate,
          endDate,
          status,
          employeeId,
          serviceId,
        } = request.query

        const offset = (page - 1) * perPage

        const filters = [
          eq(appointments.establishmentId, establishmentId),
          startDate && gte(appointments.startTime, new Date(startDate)),
          (endDate || startDate) &&
            lte(
              appointments.startTime,
              new Date(`${endDate || startDate}T23:59:59`)
            ),
          status && eq(appointments.status, status),
          employeeId && eq(appointments.employeeId, employeeId),
          serviceId && eq(appointments.serviceId, serviceId),
        ].filter(Boolean) as Parameters<typeof and>[0][]

        console.log({ startDate, endDate })

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
              professional: {
                id: employees.id,
                name: employees.name,
              },
              customer: {
                id: customers.id,
                name: customers.name,
                phoneNumber: customers.phoneNumber,
              },
              customerServicePackageId: appointments.customerServicePackageId,
              package: {
                id: packages.id,
                name: packages.name,
                description: packages.description,
                price: packages.price,
              },
              packageData: {
                id: customerServicePackages.id,
                remainingSessions: customerServicePackages.remainingSessions,
                totalSessions: customerServicePackages.totalSessions,
                paid: customerServicePackages.paid,
              },
            })
            .from(appointments)
            .innerJoin(services, eq(appointments.serviceId, services.id))
            .innerJoin(employees, eq(appointments.employeeId, employees.id))
            .innerJoin(customers, eq(appointments.customerId, customers.id))
            .leftJoin(
              customerServicePackages,
              eq(
                appointments.customerServicePackageId,
                customerServicePackages.id
              )
            )
            .leftJoin(
              packages,
              eq(customerServicePackages.servicePackageId, packages.id)
            )
            .where(and(...filters))
            .orderBy(asc(appointments.startTime))
            .limit(perPage)
            .offset(offset),
          db
            .select({
              count: sql<number>`COUNT(*)`.mapWith(Number),
            })
            .from(appointments)
            .where(and(...filters)),
        ])

        const response = {
          appointments: data.map(app => ({
            id: app.id,
            startTime: app.startTime.toISOString(),
            endTime: app.endTime.toISOString(),
            status: app.status,
            service: app.service,
            professional: app.professional,
            customer: app.customer,
            package:
              app.customerServicePackageId &&
              app.package?.id &&
              app.packageData?.id
                ? {
                    id: app.package.id,
                    name: app.package.name,
                    description: app.package.description,
                    price: app.package.price,
                    remainingSessions: app.packageData.remainingSessions,
                    totalSessions: app.packageData.totalSessions,
                    paid: app.packageData.paid,
                  }
                : null,
          })),
          total: Number(count),
        }

        return reply.send(response)
      }
    )
}
