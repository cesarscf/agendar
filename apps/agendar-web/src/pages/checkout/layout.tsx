import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { env } from "@/env"

export const Route = createFileRoute("/checkout")({
  component: RouteComponent,
})

function RouteComponent() {
  const stripePromise = loadStripe(env.VITE_STRIPE_PUBLISHABLE_KEY)

  return (
    <Elements stripe={stripePromise}>
      <Outlet />
    </Elements>
  )
}
