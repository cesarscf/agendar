import { api } from "../api-client"
import { handleApiError } from "@/utils"

export async function cancelSubscription() {
  try {
    await api.delete<boolean>("/subscriptions/cancel")

    return {
      data: true,
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
