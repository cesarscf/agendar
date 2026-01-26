import { eq, inArray } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { loyaltyPointRules, loyaltyPrograms, services } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { requireActiveSubscription } from "@/middlewares/require-active-subscription"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"

const pointRuleSchema = z.object({
  serviceId: z.string().uuid(),
  serviceName: z.string(),
  points: z.number().int().min(1),
})

const loyaltyProgramSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  serviceRewardId: z.string().uuid(),
  serviceRewardName: z.string(),
  requiredPoints: z.number(),
  active: z.boolean(),
  rules: z.array(pointRuleSchema),
})

export async function getLoyaltyPrograms(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.register(requireActiveSubscription)

    typedApp.get(
      "/loyalty-programs",
      {
        schema: {
          tags: ["Loyalty"],
          summary: "Get loyalties programs",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          response: {
            200: z.array(loyaltyProgramSchema),
          },
        },
      },
      async (request, reply) => {
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const programs = await db.query.loyaltyPrograms.findMany({
          where: eq(loyaltyPrograms.establishmentId, establishmentId),
        })

        if (!programs.length) {
          return reply.send([])
        }

        const rewardServiceIds = programs.map(p => p.serviceRewardId)

        const rewardServices = await db.query.services.findMany({
          where: inArray(services.id, rewardServiceIds),
          columns: { id: true, name: true },
        })
        const rewardServiceNameById = Object.fromEntries(
          rewardServices.map(s => [s.id, s.name])
        )

        const rules = await db.query.loyaltyPointRules.findMany({
          where: inArray(
            loyaltyPointRules.loyaltyProgramId,
            programs.map(p => p.id)
          ),
        })

        const ruleServiceIds = rules.map(r => r.serviceId)
        const ruleServices = await db.query.services.findMany({
          where: inArray(services.id, ruleServiceIds),
          columns: { id: true, name: true },
        })
        const ruleServiceNameById = Object.fromEntries(
          ruleServices.map(s => [s.id, s.name])
        )

        const result = programs
          .map(program => ({
            ...program,
            serviceRewardName:
              rewardServiceNameById[program.serviceRewardId] ??
              "Serviço não encontrado",
            rules: rules
              .filter(rule => rule.loyaltyProgramId === program.id)
              .map(rule => ({
                ...rule,
                serviceName:
                  ruleServiceNameById[rule.serviceId] ??
                  "Serviço não encontrado",
              })),
          }))
          .sort((a, b) => a.name.localeCompare(b.name))

        return reply.send(result)
      }
    )
  })
}
