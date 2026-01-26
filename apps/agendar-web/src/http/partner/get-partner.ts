import { api } from "@/lib/api-client"

export type Subscription = {
  id: string
  status: string
  endedAt: Date
  createdAt: Date
}

export type Partner = {
  id: string
  name: string
  email: string
  establishments: {
    id: string
    name: string
  }[]
  subscriptions: Subscription[]
}

export interface GetPartnerResponse {
  partner: Partner
}

export async function getPartner() {
  const response = await api.get<GetPartnerResponse>("/partner")

  return response.data
}
