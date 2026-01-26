import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "@/db"
import { customerLoyaltyPoints, loyaltyPrograms, services } from "@/db/schema"
import { customerAuth } from "@/middlewares/customer-auth"
import { customerHeaderSchema } from "@/utils/schemas/headers"

export async function listCustomerLoyaltyPrograms(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(customerAuth)
    typedApp.get(
      "/my-loyalty-programs",
      {
        schema: {
          tags: ["Customers", "Loyalty"],
          headers: customerHeaderSchema,
          summary: "Listar planos de fidelidade do cliente",
          description:
            "Lista todos os planos de fidelidade em que o cliente está ou já participou, incluindo pontos acumulados",
          response: {
            200: z.object({
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
            }),
          },
        },
      },
      async (request, reply) => {
        const customerId = await request.getCurrentCustomerId()

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
          .where(eq(customerLoyaltyPoints.customerId, customerId))

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

        return reply.send({
          loyaltyPrograms: formattedPrograms,
        })
      }
    )
  })
}
