import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type EmployeeCommissionItem = {
  employee: string
  revenueInCents: number
}

export type GetEmployeeCommissionResponse = {
  items: EmployeeCommissionItem[]
}

export type GetEmployeeCommissionParams = {
  startDate: string
  endDate: string
}

export async function getEmployeeCommission(
  params: GetEmployeeCommissionParams
) {
  try {
    const result = await api.get<GetEmployeeCommissionResponse>(
      "/establishments/employee-commission",
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
