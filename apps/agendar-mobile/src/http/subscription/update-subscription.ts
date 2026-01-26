import { handleApiError } from "@/utils"
import { api } from "../api-client"

export interface UpdateSubscriptionResponse {
  newPlanName: string
  status: string
  currentPeriodEnd: string
}

export async function updateSubscription(newPlanId: string) {
  try {
    const result = await api.patch<UpdateSubscriptionResponse>(
      "/subscriptions/change-plan",
      {
        newPlanId,
      }
    )

    return {
      data: result.data,
      error: null,
    }
  } catch (err) {
    const { error } = handleApiError(err)

    return {
      data: null,
      error,
    }
  }
}
