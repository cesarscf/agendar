import { cancelAppointment } from "@/http/appointments/cancel-appointment"
import { queryClient } from "@/lib/react-query"
import { useMutation } from "@tanstack/react-query"

interface CancelAppointmentParams {
  appointmentId: string
  reason: string
}

export function useCancelAppointment() {
  return useMutation<boolean, string, CancelAppointmentParams>({
    mutationFn: async ({ appointmentId, reason }: CancelAppointmentParams) => {
      const { data, error } = await cancelAppointment(appointmentId, reason)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      })
    },
  })
}
