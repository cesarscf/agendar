import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type DailyRevenueItem = {
  date: string
  value: number
}

export type GetDailyRevenueResponse = {
  items: DailyRevenueItem[]
}

export type GetDailyRevenueParams = {
  startDate: string
  endDate: string
}

export async function getDailyRevenue(params: GetDailyRevenueParams) {
  try {
    const result = await api.get<GetDailyRevenueResponse>(
      "/establishments/daily-revenue",
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
