import { eq, inArray } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import {
  establishments,
  loyaltyPointRules,
  loyaltyPrograms,
  services,
} from "@/db/schema"

export async function getPublicLoyaltyPrograms(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:slug/loyalty-programs",
    {
      schema: {
        tags: ["Public"],
        summary: "Listar programas de fidelidade públicos da loja",
        params: z.object({ slug: z.string() }),
        response: {
          200: z.array(
            z.object({
              name: z.string(),
              serviceRewardName: z.string(),
              requiredPoints: z.number(),
              rules: z.array(
                z.object({
                  serviceName: z.string(),
                  points: z.number(),
                })
              ),
            })
          ),
        },
      },
    },
    async (req, reply) => {
      const { slug } = req.params

      const est = await db.query.establishments.findFirst({
        where: eq(establishments.slug, slug),
        columns: { id: true },
      })

      if (!est) return reply.status(404).send()

      const programs = await db.query.loyaltyPrograms.findMany({
        where: eq(loyaltyPrograms.establishmentId, est.id),
        columns: {
          id: true,
          name: true,
          serviceRewardId: true,
          requiredPoints: true,
          active: true,
        },
      })

      if (!programs.length) return reply.send([])

      // pegar serviços de recompensa
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
        columns: {
          loyaltyProgramId: true,
          serviceId: true,
          points: true,
        },
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
        .filter(p => p.active)
        .map(program => ({
          name: program.name,
          serviceRewardName:
            rewardServiceNameById[program.serviceRewardId] ??
            "Serviço não encontrado",
          requiredPoints: program.requiredPoints,
          rules: rules
            .filter(r => r.loyaltyProgramId === program.id)
            .map(r => ({
              serviceName:
                ruleServiceNameById[r.serviceId] ?? "Serviço não encontrado",
              points: r.points,
            })),
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

      return reply.send(result)
    }
  )
}
