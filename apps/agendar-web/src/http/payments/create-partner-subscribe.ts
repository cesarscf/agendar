import { api } from "@/lib/api-client"

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
  const result = await api.post<CreatePartnerSubscribeResponse>(
    "/subscriptions/subscribe",
    inputs
  )

  return result.data
}
