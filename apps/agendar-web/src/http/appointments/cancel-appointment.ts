import { api } from "@/lib/api-client"

export type CancelAppointmentParams = {
  appointmentId: string
  reason?: string
}

export async function cancelAppointment({
  appointmentId,
  reason,
}: CancelAppointmentParams) {
  await api.patch(`/partner/appointments/${appointmentId}/cancel`, { reason })
}
