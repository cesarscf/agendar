import { desc, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import fastifyPlugin from "fastify-plugin"
import { db } from "@/db"
import { subscriptions } from "@/db/schema"
import { env } from "@/env"
import { ForbiddenError } from "@/routes/_erros/forbidden-request-error"

export const requireActiveSubscription = fastifyPlugin(
  async (app: FastifyInstance) => {
    app.addHook("preHandler", async request => {
      console.log(env.NODE_ENV)
      if (env.NODE_ENV === "development") {
        return
      }

      const partnerId = await request.getCurrentPartnerId()
      const [subscription] = await db.query.subscriptions.findMany({
        where: eq(subscriptions.partnerId, partnerId),
        orderBy: [desc(subscriptions.createdAt)],
        limit: 1,
      })

      if (!subscription) {
        throw new ForbiddenError("Não é possível acessar o recurso")
      }

      const now = new Date()

      const isActive =
        subscription.status === "active" || subscription.status === "trialing"

      const notExpired = subscription.currentPeriodEnd > now

      if (!isActive || !notExpired) {
        throw new ForbiddenError("Não é possível acessar o recurso")
      }

      request.getActiveSubscription = () => ({
        ...subscription,
      })
    })
  }
)
