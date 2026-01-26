import { db } from "@/db"
import {
  appointments,
  customerLoyaltyPoints,
  customerServicePackages,
  customers,
  employees,
  establishments,
  loyaltyPrograms,
  packages,
  services,
} from "@/db/schema"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"

import { and, desc, eq } from "drizzle-orm"
import z from "zod"

export async function getCustomerInfoByPhone(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.get(
      "/customers/:slug/phone/:phone",
      {
        schema: {
          tags: ["Public"],
          summary: "Get customer info by phone number",
          params: z.object({
            slug: z.string(),
            phone: z.string(),
          }),
          response: {
            200: z.object({
              customer: z.object({
                name: z.string(),
                phoneNumber: z.string(),
                birthDate: z.date(),
              }),
              packages: z.array(
                z.object({
                  packageName: z.string(),
                  packageDescription: z.string().nullable(),
                  purchasedAt: z.date(),
                  remainingSessions: z.number(),
                  totalSessions: z.number(),
                  paid: z.boolean(),
                })
              ),
              loyaltyPrograms: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  points: z.number(),
                  requiredPoints: z.number(),
                  active: z.boolean(),
                  rewardService: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                  }),
                  progress: z.number().min(0).max(100),
                  canRedeem: z.boolean(),
                })
              ),
              appointments: z.array(
                z.object({
                  id: z.string().uuid(),
                  serviceName: z.string(),
                  employeeName: z.string(),
                  date: z.string(),
                  startTime: z.date(),
                  endTime: z.date(),
                  status: z.enum(["scheduled", "completed", "canceled"]),
                  checkin: z.boolean(),
                  paid: z.boolean(),
                })
              ),
            }),
            404: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, phone } = request.params

        const establishment = await db.query.establishments.findFirst({
          where: () => eq(establishments.slug, slug),
        })

        if (!establishment) {
          return reply.status(404).send({
            message: "Establishment not found",
          })
        }

        const customer = await db.query.customers.findFirst({
          where: () =>
            and(
              eq(customers.phoneNumber, phone),
              eq(customers.establishmentId, establishment.id)
            ),
        })

        console.log(customer)

        if (!customer) {
          return reply.status(404).send({
            message: "Customer not found",
          })
        }

        const customerPackages = await db
          .select({
            packageName: packages.name,
            packageDescription: packages.description,
            purchasedAt: customerServicePackages.purchasedAt,
            remainingSessions: customerServicePackages.remainingSessions,
            totalSessions: customerServicePackages.totalSessions,
            paid: customerServicePackages.paid,
          })
          .from(customerServicePackages)
          .innerJoin(
            packages,
            eq(customerServicePackages.servicePackageId, packages.id)
          )
          .where(eq(customerServicePackages.customerId, customer.id))

        const customerLoyaltyData = await db
          .select({
            loyaltyProgramId: customerLoyaltyPoints.loyaltyProgramId,
            points: customerLoyaltyPoints.points,
            programName: loyaltyPrograms.name,
            requiredPoints: loyaltyPrograms.requiredPoints,
            active: loyaltyPrograms.active,
            rewardServiceId: loyaltyPrograms.serviceRewardId,
            rewardServiceName: services.name,
          })
          .from(customerLoyaltyPoints)
          .innerJoin(
            loyaltyPrograms,
            eq(customerLoyaltyPoints.loyaltyProgramId, loyaltyPrograms.id)
          )
          .innerJoin(services, eq(loyaltyPrograms.serviceRewardId, services.id))
          .where(eq(customerLoyaltyPoints.customerId, customer.id))

        const customerAppointments = await db
          .select({
            id: appointments.id,
            serviceName: services.name,
            employeeName: employees.name,
            date: appointments.date,
            startTime: appointments.startTime,
            endTime: appointments.endTime,
            status: appointments.status,
            checkin: appointments.checkin,
            paymentType: appointments.paymentType,
            paymentAmount: appointments.paymentAmount,
          })
          .from(appointments)
          .innerJoin(services, eq(appointments.serviceId, services.id))
          .innerJoin(employees, eq(appointments.employeeId, employees.id))
          .where(eq(appointments.customerId, customer.id))
          .orderBy(desc(appointments.date), desc(appointments.startTime))

        const formattedAppointments = customerAppointments.map(appointment => ({
          id: appointment.id,
          serviceName: appointment.serviceName,
          employeeName: appointment.employeeName,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          status: appointment.status,
          checkin: appointment.checkin,
          paid: !!(appointment.paymentType && appointment.paymentAmount),
        }))

        console.log(formattedAppointments)

        const formattedPrograms = customerLoyaltyData.map(program => {
          const progress = Math.min(
            (program.points / program.requiredPoints) * 100,
            100
          )
          const canRedeem = program.points >= program.requiredPoints

          return {
            id: program.loyaltyProgramId,
            name: program.programName,
            points: program.points,
            requiredPoints: program.requiredPoints,
            active: program.active,
            rewardService: {
              id: program.rewardServiceId,
              name: program.rewardServiceName,
            },
            progress: Math.round(progress * 100) / 100,
            canRedeem,
          }
        })

        const res = {
          customer: {
            name: customer.name,
            phoneNumber: customer.phoneNumber,
            birthDate: customer.birthDate,
          },
          packages: customerPackages,
          loyaltyPrograms: formattedPrograms,
          appointments: formattedAppointments,
        }

        return reply.status(200).send(res)
      }
    )
  })
}
