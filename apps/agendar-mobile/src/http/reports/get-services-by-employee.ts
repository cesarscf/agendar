import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type ServicesByEmployeeItem = {
  employee: string
  totalBookings: number
}

export type GetServicesByEmployeeResponse = {
  items: ServicesByEmployeeItem[]
}

export type GetServicesByEmployeeParams = {
  startDate: string
  endDate: string
}

export async function getServicesByEmployee(
  params: GetServicesByEmployeeParams
) {
  try {
    const result = await api.get<GetServicesByEmployeeResponse>(
      "/establishments/services-by-employee",
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
