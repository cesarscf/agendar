import { api } from "../api-client"
import { handleApiError, convertLocalDateToUTC } from "@/utils"

interface CreateEmployeeBlockRequest {
  employeeId: string
  startsAt: Date
  endsAt: Date
  reason: string
}

export async function createEmployeeBlock({
  employeeId,
  startsAt,
  endsAt,
  reason,
}: CreateEmployeeBlockRequest) {
  try {
    const response = await api.post(`/employees/${employeeId}/blocks`, {
      startsAt: convertLocalDateToUTC(startsAt),
      endsAt: convertLocalDateToUTC(endsAt),
      reason,
    })

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
