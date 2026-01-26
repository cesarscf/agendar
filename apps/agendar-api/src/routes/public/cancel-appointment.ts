import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { appointments, customers, establishments } from "@/db/schema"
import { customerServicePackageUsages } from "@/db/schema/customer-service-packages-usages"
import { BadRequestError } from "@/routes/_erros/bad-request-error"

export async function cancelAppointmentPublic(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.patch(
      "/:slug/appointments/:id/cancel",
      {
        schema: {
          tags: ["Public"],
          summary: "Cancel appointment (public)",
          params: z.object({
            slug: z.string(),
            id: z.string().uuid(),
          }),
          body: z.object({
            phoneNumber: z.string().min(1, "Telefone é obrigatório"),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, id } = request.params
        const { phoneNumber } = request.body

        const [establishment] = await db
          .select()
          .from(establishments)
          .where(eq(establishments.slug, slug))

        if (!establishment) {
          throw new BadRequestError("Estabelecimento não encontrado")
        }

        const [appointment] = await db
          .select({
            appointment: appointments,
            customer: customers,
          })
          .from(appointments)
          .innerJoin(customers, eq(appointments.customerId, customers.id))
          .where(
            and(
              eq(appointments.id, id),
              eq(appointments.establishmentId, establishment.id)
            )
          )

        if (!appointment) {
          throw new BadRequestError("Agendamento não encontrado")
        }

        if (appointment.customer.phoneNumber !== phoneNumber) {
          throw new BadRequestError("Telefone não corresponde ao agendamento")
        }

        if (appointment.appointment.status === "canceled") {
          throw new BadRequestError("Agendamento já foi cancelado")
        }

        const appointmentStartTime = new Date(
          `${appointment.appointment.date}T${appointment.appointment.startTime}`
        )
        const appointmentEndTime = new Date(
          `${appointment.appointment.date}T${appointment.appointment.endTime}`
        )
        const now = new Date()

        if (appointmentEndTime < now) {
          throw new BadRequestError(
            "Não é possível cancelar um agendamento que já passou"
          )
        }

        if (appointmentStartTime <= now && now <= appointmentEndTime) {
          throw new BadRequestError(
            "Não é possível cancelar um agendamento que já está acontecendo"
          )
        }

        if (appointment.appointment.customerServicePackageId) {
          await db
            .delete(customerServicePackageUsages)
            .where(
              eq(
                customerServicePackageUsages.appointmentId,
                appointment.appointment.id
              )
            )
        }

        await db
          .update(appointments)
          .set({
            status: "canceled",
            paymentNote: "Cancelado pelo cliente",
          })
          .where(eq(appointments.id, id))

        return reply.status(204).send()
      }
    )
  })
}
