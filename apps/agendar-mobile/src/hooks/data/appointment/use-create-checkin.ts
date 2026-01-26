import { useMutation } from "@tanstack/react-query"
import { createCheckin } from "@/http/appointments/create-checkin"
import { queryClient } from "@/lib/react-query"
import type { CheckinRequest } from "@/lib/validations/checkin"

export function useCreateCheckin() {
  return useMutation<{ success: boolean }, string, CheckinRequest>({
    mutationFn: async inputs => {
      const { data, error } = await createCheckin(inputs)
      if (error) throw error
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    },
  })
}
