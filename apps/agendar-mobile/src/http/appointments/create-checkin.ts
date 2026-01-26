import type { CheckinRequest } from "@/lib/validations/checkin"
import { api } from "../api-client"
import { handleApiError } from "@/utils"

export async function createCheckin(data: CheckinRequest) {
  try {
    const response = await api.patch<{ success: boolean }>(
      `/partner/appointments/${data.appointmentId}/status`,
      {
        status: data.status,
        paymentType: data.paymentType,
        paymentAmount: data.paymentAmount,
        notes: data.notes,
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
