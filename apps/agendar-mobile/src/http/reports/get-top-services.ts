import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type TopServiceItem = {
  service: string
  totalRevenueInCents: number
}

export type GetTopServicesResponse = {
  items: TopServiceItem[]
}

export type GetTopServicesParams = {
  startDate: string
  endDate: string
}

export async function getTopServices(params: GetTopServicesParams) {
  try {
    const result = await api.get<GetTopServicesResponse>(
      "/establishments/top-services",
      { params }
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
