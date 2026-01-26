import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type GetAppointmentsMetricsResponse = {
  appointmentsCount: number
  value: number
}

export type GetAppointmentsMetricsParams = {
  startDate: string
  endDate: string
}

export async function getAppointmentsMetrics(
  params: GetAppointmentsMetricsParams
) {
  try {
    const result = await api.get<GetAppointmentsMetricsResponse>(
      "/establishments/appointments-metrics",
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
