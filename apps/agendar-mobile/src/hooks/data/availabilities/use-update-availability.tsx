import { useMutation } from "@tanstack/react-query"
import { updateEstablishmentAvailability } from "@/http/establishment/update-establishment-availability"
import { queryClient } from "@/lib/react-query"
import type { UpdateAvailabilityRequest } from "@/lib/validations/availability"

export function useUpdateAvailability() {
  return useMutation<void, string, UpdateAvailabilityRequest>({
    mutationFn: async inputs => {
      await updateEstablishmentAvailability(inputs)
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["availabilities"],
      })
    },
  })
}
