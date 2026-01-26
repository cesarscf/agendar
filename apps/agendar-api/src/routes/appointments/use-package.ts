import { db } from "@/db"
import {
  appointments,
  customerServicePackages,
  employeeServices,
  employees,
  packageItems,
  packages,
} from "@/db/schema"
import { customerAuth } from "@/middlewares/customer-auth"
import { DateUtils } from "@/utils/get-date"
import { customerHeaderSchema } from "@/utils/schemas/headers"
import { addMinutes } from "date-fns"
import { format } from "date-fns"
import { and, eq, gt, isNull, lt, or } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"

export const createAppointmentSchema = z.object({
  employeeId: z.string().uuid(),
  packageId: z.string().uuid(),
  date: z.coerce.date(),
  startTime: z.coerce.string({ message: "Horário inválido" }),
})

export async function createAppointmentUsingPackage(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(customerAuth)

    typedApp.post(
      "/appointments/use-package",
      {
        schema: {
          tags: ["Appointments"],
          summary: "Create appointment using service package",
          headers: customerHeaderSchema,
          body: createAppointmentSchema,
          response: {
            204: z.null(),
            400: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { customerId, establishmentId } =
          await request.getCurrentCustomerEstablishmentId()
        const { employeeId, date, packageId, startTime } = request.body

        const pack = await db.query.packages.findFirst({
          where: eq(packages.id, packageId),
          with: {
            packageItems: true,
          },
        })

        if (!pack) {
          throw new Error("Pacote não encontrado")
        }

        const packageItem = pack.packageItems.shift()
        if (!packageItem) {
          throw new Error("Item do pacote não encontrado")
        }

        const serviceId = packageItem.serviceId

        const employee = await db.query.employees.findFirst({
          where: eq(employees.id, employeeId),
        })

        if (!employee) {
          throw new Error("Funcionário não encontrado")
        }

        const employeeService = await db.query.employeeServices.findFirst({
          where: and(
            eq(employeeServices.employeeId, employeeId),
            eq(employeeServices.serviceId, serviceId)
          ),
          with: {
            service: true,
          },
        })

        if (!employeeService) {
          throw new Error("Serviço não encontrado para o funcionário")
        }

        const formattedDate = format(date, "yyyy-MM-dd")
        const duration = employeeService.service.durationInMinutes
        const startDatetime = DateUtils.combineDateAndTimeUTC(date, startTime)
        const endTime = addMinutes(startDatetime, duration)

        const conflictingAppointment = await db
          .select()
          .from(appointments)
          .where(
            and(
              eq(appointments.employeeId, employeeId),
              eq(appointments.establishmentId, establishmentId),
              lt(appointments.startTime, endTime),
              gt(appointments.endTime, startDatetime),
              eq(appointments.date, formattedDate)
            )
          )
          .limit(1)
          .then(res => res[0])

        if (conflictingAppointment) {
          return reply
            .status(409)
            .send({ message: "Já existe um agendamento neste horário" })
        }

        const validPackages = await db
          .select({
            id: customerServicePackages.id,
            totalSessions: customerServicePackages.totalSessions,
            servicePackageId: customerServicePackages.servicePackageId,
          })
          .from(customerServicePackages)
          .innerJoin(
            packages,
            eq(packages.id, customerServicePackages.servicePackageId)
          )
          .innerJoin(packageItems, eq(packageItems.packageId, packages.id))
          .where(
            and(
              eq(customerServicePackages.customerId, customerId),
              gt(customerServicePackages.remainingSessions, 0),
              eq(packageItems.serviceId, serviceId),
              or(
                isNull(customerServicePackages.expiresAt),
                gt(customerServicePackages.expiresAt, new Date())
              )
            )
          )
          .orderBy(customerServicePackages.purchasedAt)

        let selectedPackage = null
        let packageIdForNewLink = null

        // Busca um pacote que ainda tenha slots disponíveis para agendamento
        for (const pkg of validPackages) {
          // Guarda o packageId para criar um novo link se necessário
          if (!packageIdForNewLink) {
            packageIdForNewLink = pkg.servicePackageId
          }

          // Conta quantos agendamentos NÃO CANCELADOS já estão reservados com este pacote
          const reservedAppointments = await db
            .select()
            .from(appointments)
            .where(
              and(
                eq(appointments.customerServicePackageId, pkg.id),
                or(
                  eq(appointments.status, "scheduled"),
                  eq(appointments.status, "completed")
                )
              )
            )

          // Se ainda há slots disponíveis neste pacote, seleciona ele
          if (reservedAppointments.length < pkg.totalSessions) {
            selectedPackage = pkg
            break
          }
        }

        // Se nenhum pacote existente tem slots disponíveis, cria um novo link
        if (!selectedPackage) {
          if (!packageIdForNewLink) {
            return reply
              .status(400)
              .send({ message: "No valid package available for this service." })
          }

          // Busca o package original para calcular totalSessions
          const packageRecord = await db.query.packages.findFirst({
            where: eq(packages.id, packageIdForNewLink),
            with: {
              packageItems: true,
            },
          })

          if (!packageRecord) {
            return reply.status(400).send({ message: "Package not found." })
          }

          const totalSessions = packageRecord.packageItems.reduce(
            (total, item) => total + item.quantity,
            0
          )

          // Cria um novo customerServicePackage
          const [newCustomerPackage] = await db
            .insert(customerServicePackages)
            .values({
              customerId,
              servicePackageId: packageIdForNewLink,
              totalSessions,
              remainingSessions: totalSessions,
              paid: false,
            })
            .returning({
              id: customerServicePackages.id,
              totalSessions: customerServicePackages.totalSessions,
            })

          selectedPackage = newCustomerPackage
        }

        await db.insert(appointments).values({
          employeeId,
          serviceId,
          customerId,
          startTime: startDatetime,
          endTime,
          date: formattedDate,
          establishmentId,
          customerServicePackageId: selectedPackage.id,
        })

        return reply.status(204).send()
      }
    )
  })
}
