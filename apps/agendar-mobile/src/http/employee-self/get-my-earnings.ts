import { handleApiError } from "@/utils"
import { api } from "../api-client"

export interface GetMyEarningsParams {
  startDate: string
  endDate: string
}

export interface MyEarnings {
  revenueInCents: number
  commissionInCents: number
  completedAppointments: number
}

export async function getMyEarnings(
  params: GetMyEarningsParams
) {
  try {
    const response = await api.get<MyEarnings>(
      "/employee/earnings",
      { params }
    )
    return { data: response.data, error: null }
  } catch (err) {
    const { error } = handleApiError(err)
    return { data: null, error }
  }
}
