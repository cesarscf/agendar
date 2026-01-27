import { api } from "@/lib/api-client"

interface CreateCheckoutSessionResponse {
  url: string
}

export async function createCheckoutSession(planId: string) {
  const response = await api.post<CreateCheckoutSessionResponse>(
    "/subscriptions/checkout-session",
    { planId }
  )

  return response.data
}
