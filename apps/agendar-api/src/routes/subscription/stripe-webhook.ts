import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type Stripe from "stripe"
import { stripe } from "@/clients/stripe"
import { db } from "@/db"
import { plans, subscriptions } from "@/db/schema"
import { env } from "@/env"

export async function stripeWebhook(app: FastifyInstance) {
  app.post(
    "/webhook/stripe",
    {
      config: {
        rawBody: true,
      },
    },
    async (request, reply) => {
      const sig = request.headers["stripe-signature"]
      if (!sig) {
        return reply
          .status(400)
          .send({ message: "Missing stripe-signature header" })
      }

      const rawBody = request.rawBody
      if (!rawBody) {
        return reply.status(400).send({ message: "Missing raw body" })
      }

      let event: Stripe.Event

      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          sig,
          env.STRIPE_WEBHOOK_SECRET
        )
      } catch (err) {
        request.log.error(err, "Webhook signature verification failed")
        return reply.status(400).send(`Webhook error: ${err}`)
      }

      request.log.info({ type: event.type }, "Processing Stripe webhook")

      switch (event.type) {
        // Checkout completed - create subscription in DB
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session

          if (session.mode !== "subscription" || !session.subscription) {
            break
          }

          const subscriptionId = session.subscription as string
          const partnerId = session.metadata?.partnerId
          const planId = session.metadata?.planId

          if (!partnerId || !planId) {
            request.log.warn("Missing metadata in checkout session")
            break
          }

          // Fetch full subscription details from Stripe
          const stripeSub = await stripe.subscriptions.retrieve(subscriptionId)
          const currentPeriodEnd =
            stripeSub.items.data[0]?.current_period_end ?? 0

          // Check if subscription already exists
          const existing = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.integrationSubscriptionId, subscriptionId),
          })

          if (existing) {
            // Update existing
            await db
              .update(subscriptions)
              .set({
                status: stripeSub.status,
                currentPeriodEnd: new Date(currentPeriodEnd * 1000),
                cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
                planId,
              })
              .where(eq(subscriptions.id, existing.id))
          } else {
            // Upsert: delete any existing subscription for this partner first
            await db
              .delete(subscriptions)
              .where(eq(subscriptions.partnerId, partnerId))

            // Create new subscription
            await db.insert(subscriptions).values({
              partnerId,
              planId,
              integrationSubscriptionId: subscriptionId,
              status: stripeSub.status,
              currentPeriodEnd: new Date(currentPeriodEnd * 1000),
              cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            })
          }

          request.log.info({ partnerId, planId }, "Subscription created/updated")
          break
        }

        // Subscription updated (plan change, renewal, etc)
        case "customer.subscription.updated": {
          const sub = event.data.object as Stripe.Subscription
          const subCurrentPeriodEnd = sub.items.data[0]?.current_period_end ?? 0

          // Get the price ID to find the corresponding plan
          const priceId = sub.items.data[0]?.price?.id
          let planId: string | undefined

          if (priceId) {
            const [plan] = await db
              .select({ id: plans.id })
              .from(plans)
              .where(eq(plans.integrationPriceId, priceId))

            planId = plan?.id
          }

          const updateData: Record<string, unknown> = {
            status: sub.status,
            currentPeriodEnd: new Date(subCurrentPeriodEnd * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          }

          if (planId) {
            updateData.planId = planId
          }

          await db
            .update(subscriptions)
            .set(updateData)
            .where(eq(subscriptions.integrationSubscriptionId, sub.id))

          request.log.info({ subscriptionId: sub.id }, "Subscription updated")
          break
        }

        // Subscription deleted/canceled
        case "customer.subscription.deleted": {
          const sub = event.data.object as Stripe.Subscription

          await db
            .update(subscriptions)
            .set({
              status: "canceled",
              endedAt: new Date(),
              cancelAtPeriodEnd: false,
            })
            .where(eq(subscriptions.integrationSubscriptionId, sub.id))

          request.log.info({ subscriptionId: sub.id }, "Subscription canceled")
          break
        }

        // Invoice payment failed
        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice
          const subscriptionId =
            invoice.parent?.subscription_details?.subscription

          if (!subscriptionId || typeof subscriptionId !== "string") {
            break
          }

          await db
            .update(subscriptions)
            .set({ status: "past_due" })
            .where(eq(subscriptions.integrationSubscriptionId, subscriptionId))

          // TODO: Send email notification to partner about failed payment

          request.log.warn({ subscriptionId }, "Invoice payment failed")
          break
        }

        // Invoice paid successfully
        case "invoice.paid": {
          const invoice = event.data.object as Stripe.Invoice
          const subscriptionId =
            invoice.parent?.subscription_details?.subscription

          if (!subscriptionId || typeof subscriptionId !== "string") {
            break
          }

          // Fetch fresh subscription data
          const stripeSub = await stripe.subscriptions.retrieve(subscriptionId)
          const paidPeriodEnd = stripeSub.items.data[0]?.current_period_end ?? 0

          await db
            .update(subscriptions)
            .set({
              status: stripeSub.status,
              currentPeriodEnd: new Date(paidPeriodEnd * 1000),
            })
            .where(eq(subscriptions.integrationSubscriptionId, subscriptionId))

          request.log.info({ subscriptionId }, "Invoice paid")
          break
        }

        default:
          request.log.debug({ type: event.type }, "Unhandled webhook event")
          break
      }

      return reply.status(200).send({ received: true })
    }
  )
}
