import { api } from "@/lib/api-client"

export interface GetMyEarningsParams {
  startDate: string
  endDate: string
}

export interface GetMyEarningsResponse {
  revenueInCents: number
  commissionInCents: number
  completedAppointments: number
}

export async function getMyEarnings(
  params: GetMyEarningsParams
) {
  const response =
    await api.get<GetMyEarningsResponse>(
      "/employee/earnings",
      { params }
    )
  return response.data
}
