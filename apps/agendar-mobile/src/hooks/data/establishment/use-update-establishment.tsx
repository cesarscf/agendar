import { updateEstablishment } from "@/http/establishment/update-establishment"
import { queryClient } from "@/lib/react-query"
import type { UpdateEstablishmentRequest } from "@/lib/validations/establishment"

import { useMutation } from "@tanstack/react-query"

export function useUpdateEstablishment() {
  return useMutation<boolean, string, UpdateEstablishmentRequest>({
    mutationFn: async inputs => {
      const { data, error } = await updateEstablishment(inputs)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["establishment"],
      })
    },
  })
}
