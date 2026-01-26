import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { appointments } from "@/db/schema/appointments"
import { customerServicePackageUsages } from "@/db/schema/customer-service-packages-usages"
import { auth } from "@/middlewares/auth"
import { requireActiveSubscription } from "@/middlewares/require-active-subscription"
import { BadRequestError } from "@/routes/_erros/bad-request-error"

export async function cancelAppointment(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.register(requireActiveSubscription)
    typedApp.patch(
      "/partner/appointments/:id/cancel",
      {
        schema: {
          tags: ["Appointments"],
          summary: "Cancel appointment",
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            reason: z.string().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()
        const { id } = request.params
        const { reason } = request.body

        const [appointment] = await db
          .select()
          .from(appointments)
          .where(
            and(
              eq(appointments.id, id),
              eq(appointments.establishmentId, establishmentId)
            )
          )

        if (!appointment) {
          throw new BadRequestError("Agendamento não encontrado")
        }

        if (appointment.status === "canceled") {
          throw new BadRequestError("Agendamento já foi cancelado")
        }

        const appointmentStartTime = new Date(
          `${appointment.date}T${appointment.startTime}`
        )
        const appointmentEndTime = new Date(
          `${appointment.date}T${appointment.endTime}`
        )
        const now = new Date()

        // Verifica se o agendamento já passou completamente
        if (appointmentEndTime < now) {
          throw new BadRequestError(
            "Não é possível cancelar um agendamento que já passou"
          )
        }

        // Verifica se o agendamento já está acontecendo
        if (appointmentStartTime <= now && now <= appointmentEndTime) {
          throw new BadRequestError(
            "Não é possível cancelar um agendamento que já está acontecendo"
          )
        }

        if (appointment.customerServicePackageId) {
          await db
            .delete(customerServicePackageUsages)
            .where(
              eq(customerServicePackageUsages.appointmentId, appointment.id)
            )
        }

        await db
          .update(appointments)
          .set({
            status: "canceled",
            paymentNote: reason ? `Cancelado: ${reason}` : "Cancelado",
          })
          .where(eq(appointments.id, id))

        return reply.status(204).send()
      }
    )
  })
}
