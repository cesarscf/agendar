import { api } from "../api-client"
import { handleApiError } from "@/utils"

export async function cancelAppointment(appointmentId: string, reason: string) {
  try {
    await api.patch(`/partner/appointments/${appointmentId}/cancel`, { reason })

    return {
      data: true,
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
