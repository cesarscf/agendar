import { api } from "../api-client"
import { handleApiError, convertLocalTimeToUTC } from "@/utils"

interface CreateEmployeeRecurringBlockRequest {
  employeeId: string
  weekday: number
  startTime: string
  endTime: string
  reason: string
}

export async function createEmployeeRecurringBlock({
  employeeId,
  weekday,
  startTime,
  endTime,
  reason,
}: CreateEmployeeRecurringBlockRequest) {
  try {
    const response = await api.post(
      `/employees/${employeeId}/recurring-blocks`,
      {
        weekday,
        startTime: convertLocalTimeToUTC(startTime),
        endTime: convertLocalTimeToUTC(endTime),
        reason,
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
