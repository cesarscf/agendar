import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type GetNetRevenueResponse = {
  value: number
}

export type GetNetRevenueParams = {
  startDate: string
  endDate: string
}

export async function getNetRevenue(params: GetNetRevenueParams) {
  try {
    const result = await api.get<GetNetRevenueResponse>(
      "/establishments/net-revenue",
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
