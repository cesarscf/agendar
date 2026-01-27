import { api } from "@/lib/api-client"

interface CancelSubscriptionRequest {
  immediately?: boolean
}

interface CancelSubscriptionResponse {
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string
}

export async function cancelSubscription(
  options: CancelSubscriptionRequest = {}
) {
  const response = await api.post<CancelSubscriptionResponse>(
    "/subscriptions/cancel",
    options
  )

  return response.data
}
