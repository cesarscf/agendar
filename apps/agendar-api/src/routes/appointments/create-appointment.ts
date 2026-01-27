import { addMinutes, format, isAfter, isBefore } from "date-fns"
import { ptBR } from "date-fns/locale"
import { and, eq, gt, lt } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { messaging } from "@/clients/firebase"
import { sendWhatsAppMessage } from "@/clients/zapi"
import { db } from "@/db"
import {
  appointments,
  customers,
  employeeRecurringBlocks,
  employeeServices,
  employeeTimeBlocks,
  employees,
  establishments,
  fcmTokens,
  services,
} from "@/db/schema"
import { customerAuth } from "@/middlewares/customer-auth"
import { DateUtils } from "@/utils/get-date"
import { customerHeaderSchema } from "@/utils/schemas/headers"

export async function createAppointment(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(customerAuth)

    typedApp.post(
      "/appointments",
      {
        schema: {
          tags: ["Appointments"],
          headers: customerHeaderSchema,
          summary: "Create a new appointment",
          body: z.object({
            employeeId: z.string().uuid(),
            serviceId: z.string().uuid(),
            date: z.coerce.date(),
            startTime: z.coerce.string({ message: "Horário inválido" }), // 12:00:00
          }),
          response: {
            201: z.object({ id: z.string().uuid() }),
            400: z.object({ message: z.string() }),
            409: z.object({ message: z.string() }),
          },
        },
      },
      async (request, reply) => {
        const { employeeId, serviceId, date, startTime } = request.body
        const { customerId, establishmentId } =
          await request.getCurrentCustomerEstablishmentId()

        const customer = await db.query.customers.findFirst({
          where: eq(customers.id, customerId),
        })
        if (!customer) {
          return reply.status(404).send({ message: "Cliente não encontrado" })
        }

        const establishment = await db.query.establishments.findFirst({
          where: eq(establishments.id, establishmentId),
        })
        if (!establishment) {
          return reply
            .status(404)
            .send({ message: "Estabelecimento não encontrado" })
        }

        const relation = await db.query.employeeServices.findFirst({
          where: and(
            eq(employeeServices.employeeId, employeeId),
            eq(employeeServices.serviceId, serviceId)
          ),
        })
        if (!relation) {
          return reply
            .status(400)
            .send({ message: "Funcionário não presta este serviço" })
        }

        const service = await db.query.services.findFirst({
          where: eq(services.id, serviceId),
          columns: { durationInMinutes: true, name: true },
        })
        if (!service) {
          return reply.status(400).send({ message: "Serviço inválido" })
        }

        const employee = await db.query.employees.findFirst({
          where: eq(employees.id, employeeId),
          columns: { name: true },
        })

        const formattedDate = format(date, "yyyy-MM-dd")
        const duration = service.durationInMinutes
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

        // 🔍 checa bloqueios manuais
        const conflictingBlock = await db
          .select()
          .from(employeeTimeBlocks)
          .where(
            and(
              eq(employeeTimeBlocks.employeeId, employeeId),
              lt(employeeTimeBlocks.startsAt, endTime),
              gt(employeeTimeBlocks.endsAt, startDatetime)
            )
          )
          .limit(1)
          .then(res => res[0])
        if (conflictingBlock) {
          return reply
            .status(409)
            .send({ message: "Horário bloqueado pelo funcionário" })
        }

        // 🔍 checa bloqueios recorrentes
        const weekday = startDatetime.getDay()
        const recurringBlocks = await db
          .select()
          .from(employeeRecurringBlocks)
          .where(
            and(
              eq(employeeRecurringBlocks.employeeId, employeeId),
              eq(employeeRecurringBlocks.weekday, weekday)
            )
          )
        const hasRecurringConflict = recurringBlocks.some(_block => {
          return isBefore(startTime, endTime) && isAfter(endTime, startDatetime)
        })
        if (hasRecurringConflict) {
          return reply.status(409).send({
            message: "Horário bloqueado recorrentemente pelo funcionário",
          })
        }

        // ✅ cria agendamento
        const [appointment] = await db
          .insert(appointments)
          .values({
            employeeId,
            serviceId,
            customerId,
            startTime: startDatetime,
            endTime,
            date: formattedDate,
            establishmentId,
          })
          .returning({ id: appointments.id, date: appointments.date })

        // 🔥 envia resposta primeiro
        reply.status(201).send({ id: appointment.id })

        const tokenRecord = await db.query.fcmTokens.findFirst({
          where: eq(fcmTokens.userId, establishmentId),
        })

        if (tokenRecord) {
          const appointmentDateFormatted = format(
            appointment.date,
            "dd/MM 'às' HH:mm",
            { locale: ptBR }
          )
          messaging
            .send({
              token: tokenRecord.token,
              notification: {
                title: `Novo agendamento em ${establishment.name}`,
                body: `${customer.name} agendou ${service.name} para ${appointmentDateFormatted}.`,
              },
              data: {
                establishmentId,
                type: "new_appointment",
                customerName: customer.name,
                service: service.name,
                date: appointment.date,
              },
            })
            .catch(err => {
              request.log.error(err, "Erro ao enviar notificação FCM")
              console.error(err, "Erro ao enviar notificação FCM")
            })
        }

        // 📱 Envia confirmação via WhatsApp para o cliente
        if (customer.phoneNumber) {
          const appointmentDate = format(
            startDatetime,
            "dd/MM/yyyy 'às' HH:mm",
            { locale: ptBR }
          )
          const whatsappMessage = `✅ *Agendamento Confirmado!*

Olá, ${customer.name}!

Seu agendamento foi confirmado:

📍 *${establishment.name}*
💇 *Serviço:* ${service.name}
👤 *Profissional:* ${employee?.name ?? "A definir"}
📅 *Data:* ${appointmentDate}

Qualquer dúvida, entre em contato conosco.

_Mensagem automática - Agendar_`

          sendWhatsAppMessage({
            phone: customer.phoneNumber,
            message: whatsappMessage,
          }).catch(err => {
            request.log.error(err, "Erro ao enviar WhatsApp")
          })
        }
      }
    )
  })
}
