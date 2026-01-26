import type { GetAppointmentsReponse } from "@/hooks/data/appointment/use-appointments"
import { api } from "../api-client"

import { handleApiError } from "@/utils"

export interface GetAppointmentsParams {
  page?: number
  perPage?: number
  startDate?: string
  endDate?: string
  status?: "scheduled" | "completed" | "canceled"
  employeeId?: string
  serviceId?: string
}

export async function getAppointments(params: GetAppointmentsParams = {}) {
  try {
    const response = await api.get<GetAppointmentsReponse>(
      "/establishments/appointments",
      {
        params: {
          page: params.page ?? 1,
          perPage: params.perPage ?? 10,
          startDate: params.startDate,
          endDate: params.endDate,
          status: params.status,
          employeeId: params.employeeId,
          serviceId: params.serviceId,
        },
      }
    )

    return {
      data: response.data,
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
