import { handleApiError } from "@/utils"
import { api } from "../api-client"

export type EmployeeRevenueItem = {
  employee: string
  revenueInCents: number
}

export type GetEmployeeRevenueResponse = {
  items: EmployeeRevenueItem[]
}

export type GetEmployeeRevenueParams = {
  startDate: string
  endDate: string
}

export async function getEmployeeRevenue(params: GetEmployeeRevenueParams) {
  try {
    const result = await api.get<GetEmployeeRevenueResponse>(
      "/establishments/employee-revenue",
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
