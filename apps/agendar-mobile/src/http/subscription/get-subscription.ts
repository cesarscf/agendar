import { api } from "../api-client"
import { handleApiError } from "@/utils"

export interface GetSubscriptionResponse {
  id: string
  status: string
  currentPeriodEnd: string
  endedAt: Date
  integrationSubscriptionId: string
  plan: {
    id: string
    name: string
    description: string
    price: string
  }
}

export async function getSubscription(id: string) {
  try {
    const result = await api.get<GetSubscriptionResponse>(
      `/subscriptions/${id}`
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
