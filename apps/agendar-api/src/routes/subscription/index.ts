import type { FastifyInstance } from "fastify"
import { cancelSubscription } from "@/routes/subscription/cancel-subscription"
import { createCheckoutSession } from "@/routes/subscription/create-checkout-session"
import { createCustomerPortal } from "@/routes/subscription/create-customer-portal"
import { getPartnerSubscriptionById } from "@/routes/subscription/get-partner-subscription-byId"
import { listPartnerSubscriptions } from "@/routes/subscription/list-subscriptions"

export async function subscriptionRoutes(app: FastifyInstance) {
  await createCheckoutSession(app)
  await createCustomerPortal(app)
  await listPartnerSubscriptions(app)
  await getPartnerSubscriptionById(app)
  await cancelSubscription(app)
}
