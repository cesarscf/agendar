import { handleApiError } from "@/utils"
import { api } from "../api-client"

export interface CreatePartnerSubscribeRequest {
  planId: string
  cardId: string
}

export interface CreatePartnerSubscribeResponse {
  status: string
  currentPeriodEnd: string
}

export async function createPartnerSubscribe(
  inputs: CreatePartnerSubscribeRequest
) {
  try {
    const result = await api.post<CreatePartnerSubscribeResponse>(
      "/subscriptions/subscribe",
      inputs
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
