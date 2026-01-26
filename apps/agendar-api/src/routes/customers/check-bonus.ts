import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "@/db"
import { customerLoyaltyPoints, loyaltyPrograms } from "@/db/schema"
import { auth } from "@/middlewares/auth"

export async function checkBonus(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.get(
      "/check-bonus",
      {
        schema: {
          tags: ["Customers", "Loyalty"],
          summary: "Verificar se o cliente tem bônus disponível",
          description:
            "Verifica se o cliente tem pontos suficientes para resgatar um bônus para um serviço específico",
          querystring: z.object({
            customerId: z.string().uuid(),
            serviceId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              hasBonus: z.boolean(),
              currentPoints: z.number(),
              requiredPoints: z.number(),
              loyaltyProgramId: z.string().uuid().nullable(),
              rewardService: z
                .object({
                  id: z.string().uuid(),
                  name: z.string(),
                })
                .nullable(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { customerId, serviceId } = request.query

        // Busca o programa de fidelidade que tem o serviço como recompensa
        const loyaltyProgram = await db.query.loyaltyPrograms.findFirst({
          where: eq(loyaltyPrograms.serviceRewardId, serviceId),
          with: {
            rewardService: true,
          },
        })

        console.log({ loyaltyProgram })

        if (!loyaltyProgram) {
          return reply.send({
            hasBonus: false,
            currentPoints: 0,
            requiredPoints: 0,
            loyaltyProgramId: null,
            rewardService: null,
          })
        }

        // Busca os pontos do cliente no programa de fidelidade
        const customerPoints = await db.query.customerLoyaltyPoints.findFirst({
          where: and(
            eq(customerLoyaltyPoints.customerId, customerId),
            eq(customerLoyaltyPoints.loyaltyProgramId, loyaltyProgram.id)
          ),
        })

        const currentPoints = customerPoints?.points ?? 0
        const hasBonus = currentPoints >= loyaltyProgram.requiredPoints

        console.log({ customerPoints, currentPoints, hasBonus })
        return reply.send({
          hasBonus,
          currentPoints,
          requiredPoints: loyaltyProgram.requiredPoints,
          loyaltyProgramId: loyaltyProgram.id,
          rewardService: {
            id: loyaltyProgram.rewardService.id,
            name: loyaltyProgram.rewardService.name,
          },
        })
      }
    )
  })
}
