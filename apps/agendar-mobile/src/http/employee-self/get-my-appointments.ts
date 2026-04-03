import { handleApiError } from "@/utils"
import { api } from "../api-client"

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

interface GetMyAppointmentsResponse {
  appointments: MyAppointment[]
  total: number
}

export async function getMyAppointments(
  params: GetMyAppointmentsParams
) {
  try {
    const response =
      await api.get<GetMyAppointmentsResponse>(
        "/employee/appointments",
        { params }
      )
    return { data: response.data, error: null }
  } catch (err) {
    const { error } = handleApiError(err)
    return { data: null, error }
  }
}
