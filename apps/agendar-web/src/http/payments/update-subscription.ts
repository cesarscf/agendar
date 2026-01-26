import { api } from "@/lib/api-client"

export interface UpdateSubscriptionResponse {
  newPlanName: string
  status: string
  currentPeriodEnd: string
}

export async function updateSubscription(newPlanId: string) {
  const result = await api.patch<UpdateSubscriptionResponse>(
    "/subscriptions/change-plan",
    {
      newPlanId,
    }
  )
  return result.data
}
