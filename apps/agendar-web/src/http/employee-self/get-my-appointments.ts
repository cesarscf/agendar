import { api } from "@/lib/api-client"

export interface MyAppointment {
  id: string
  startTime: string
  endTime: string
  status: string
  service: {
    id: string
    name: string
    servicePrice: string
  }
  customer: {
    id: string
    name: string
    phoneNumber: string
  }
}

export interface GetMyAppointmentsParams {
  page?: number
  perPage?: number
  startDate?: string
  endDate?: string
  status?: string
}

export interface GetMyAppointmentsResponse {
  appointments: MyAppointment[]
  total: number
}

export async function getMyAppointments(
  params: GetMyAppointmentsParams
) {
  const response =
    await api.get<GetMyAppointmentsResponse>(
      "/employee/appointments",
      { params }
    )
  return response.data
}
