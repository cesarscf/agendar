import { db } from "@/db"
import {
  customerServicePackageUsages,
  customerServicePackages,
  loyaltyPointRules,
  loyaltyPrograms,
} from "@/db/schema"
import {
  appointmentStatusValues,
  appointments,
  paymentTypeValues,
} from "@/db/schema/appointments"
import { customerLoyaltyPoints } from "@/db/schema/customer-loyalty-points"
import { auth } from "@/middlewares/auth"
import { requireActiveSubscription } from "@/middlewares/require-active-subscription"
import { BadRequestError } from "@/routes/_erros/bad-request-error"
import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export async function updateAppointmentStatus(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.register(requireActiveSubscription)
    typedApp.patch(
      "/partner/appointments/:id/status",
      {
        schema: {
          tags: ["Appointments"],
          summary: "Update appointment status",
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            status: z.enum(appointmentStatusValues),
            paymentType: z.enum(paymentTypeValues),
            paymentNote: z.string().optional(),
            paymentAmount: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()
        const { id } = request.params
        const { status, paymentAmount, paymentNote, paymentType } = request.body

        const appointment = await validateAppointment(id, establishmentId)

        validateStatusChange(appointment.status, status)

        if (appointment.customerServicePackageId && status === "completed") {
          await handlePackageUsageOnCompletion(
            appointment.customerServicePackageId,
            appointment.serviceId,
            appointment.id
          )
        }

        // 4. Atualiza o agendamento no banco
        await db
          .update(appointments)
          .set({ status, paymentAmount, paymentNote, paymentType })
          .where(eq(appointments.id, id))

        // 5. Processa pontos de fidelidade se o agendamento foi completado
        if (status === "completed") {
          await handleLoyaltyPointsOnCompletion(
            appointment.customerId,
            appointment.serviceId,
            paymentType
          )
        }

        return reply.status(204).send()
      }
    )
  })
}

/**
 * Adiciona pontos de fidelidade ao cliente após completar um agendamento
 * Busca as regras de pontos do serviço e credita os pontos ao cliente
 */
async function addLoyaltyPoints(
  customerId: string,
  serviceId: string
): Promise<void> {
  const [loyaltyService] = await db
    .select({
      programId: loyaltyPointRules.loyaltyProgramId,
      points: loyaltyPointRules.points,
    })
    .from(loyaltyPointRules)
    .where(eq(loyaltyPointRules.serviceId, serviceId))

  if (!loyaltyService) {
    return
  }

  const { programId, points } = loyaltyService

  const [existingPoints] = await db
    .select()
    .from(customerLoyaltyPoints)
    .where(
      and(
        eq(customerLoyaltyPoints.customerId, customerId),
        eq(customerLoyaltyPoints.loyaltyProgramId, programId)
      )
    )

  if (existingPoints) {
    // Cliente já tem pontos neste programa - adiciona mais pontos
    await db
      .update(customerLoyaltyPoints)
      .set({
        points: existingPoints.points + points,
      })
      .where(eq(customerLoyaltyPoints.id, existingPoints.id))
  } else {
    // Primeira vez do cliente neste programa - cria registro inicial
    await db.insert(customerLoyaltyPoints).values({
      customerId,
      loyaltyProgramId: programId,
      points,
    })
  }
}

/**
 * Deduz pontos de fidelidade do cliente ao usar fidelidade como pagamento
 * Subtrai os pontos necessários (requiredPoints) do programa de fidelidade
 */
async function deductLoyaltyPoints(
  customerId: string,
  serviceId: string
): Promise<void> {
  const programIds = await db
    .selectDistinctOn([loyaltyPointRules.loyaltyProgramId])
    .from(loyaltyPointRules)
    .where(eq(loyaltyPointRules.serviceId, serviceId))

  for (const { loyaltyProgramId } of programIds) {
    const [customerPoints] = await db
      .select()
      .from(customerLoyaltyPoints)
      .where(
        and(
          eq(customerLoyaltyPoints.customerId, customerId),
          eq(customerLoyaltyPoints.loyaltyProgramId, loyaltyProgramId)
        )
      )

    if (!customerPoints) {
      continue
    }

    const [program] = await db
      .select()
      .from(loyaltyPrograms)
      .where(eq(loyaltyPrograms.id, loyaltyProgramId))

    if (!program) {
      continue
    }

    // Subtrai os pontos necessários, garantindo que não fique negativo
    await db
      .update(customerLoyaltyPoints)
      .set({
        points: Math.max(0, customerPoints.points - program.requiredPoints),
      })
      .where(eq(customerLoyaltyPoints.id, customerPoints.id))
  }
}

/**
 * Processa a lógica de fidelidade ao completar um agendamento
 * - Se pagamento for com fidelidade: deduz pontos
 * - Se pagamento for normal: adiciona pontos
 */
async function handleLoyaltyPointsOnCompletion(
  customerId: string,
  serviceId: string,
  paymentType: string
): Promise<void> {
  if (paymentType === "loyalty") {
    // Cliente pagou com fidelidade - DEDUZ pontos
    await deductLoyaltyPoints(customerId, serviceId)
  } else {
    // Cliente pagou normalmente - ADICIONA pontos
    await addLoyaltyPoints(customerId, serviceId)
  }
}

/**
 * Processa o uso de pacote de serviços ao completar um agendamento
 * Registra o uso e decrementa as sessões restantes do pacote
 */
async function handlePackageUsageOnCompletion(
  packageId: string,
  serviceId: string,
  appointmentId: string
): Promise<void> {
  // Registra o uso do pacote neste agendamento
  await db.insert(customerServicePackageUsages).values({
    customerServicePackageId: packageId,
    serviceId,
    appointmentId,
    usedAt: new Date(),
  })

  // Busca as sessões restantes do pacote
  const [packageData] = await db
    .select({
      remainingSessions: customerServicePackages.remainingSessions,
    })
    .from(customerServicePackages)
    .where(eq(customerServicePackages.id, packageId))

  if (!packageData) {
    return
  }

  // Decrementa as sessões restantes e marca como pago
  await db
    .update(customerServicePackages)
    .set({
      remainingSessions: Math.max(0, packageData.remainingSessions - 1),
      paid: true,
    })
    .where(eq(customerServicePackages.id, packageId))
}

/**
 * Valida se o agendamento existe e pertence ao estabelecimento
 */
async function validateAppointment(
  appointmentId: string,
  establishmentId: string
) {
  const [appointment] = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.id, appointmentId),
        eq(appointments.establishmentId, establishmentId)
      )
    )

  if (!appointment) {
    throw new BadRequestError("Agendamento não encontrado")
  }

  return appointment
}

/**
 * Valida se é permitido mudar o status do agendamento
 */
function validateStatusChange(currentStatus: string, newStatus: string): void {
  if (currentStatus === "completed" && newStatus !== "completed") {
    throw new BadRequestError("Cannot change status of completed appointment")
  }
}
