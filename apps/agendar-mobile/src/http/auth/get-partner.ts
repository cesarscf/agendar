import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type Partner = {
  id: string
  name: string
  email: string
  establishments: {
    id: string
    name: string
  }[]
  subscriptions: {
    id: string
    status: string
    endedAt: Date
    createdAt: Date
  }[]
}

interface GetPartnerResponse {
  partner: Partner
}

export async function getPartner() {
  try {
    const response = await api.get<GetPartnerResponse>("/partner")

    return {
      data: response.data,
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
