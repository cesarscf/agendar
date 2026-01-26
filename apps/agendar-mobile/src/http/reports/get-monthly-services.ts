import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type MonthlyServiceItem = {
  month: number
  value: number
}

export type GetMonthlyServicesResponse = {
  items: MonthlyServiceItem[]
}

export type GetMonthlyServicesParams = {
  serviceId?: string
}

export async function getMonthlyServices(params?: GetMonthlyServicesParams) {
  try {
    const result = await api.get<GetMonthlyServicesResponse>(
      "/establishments/monthly-services",
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
