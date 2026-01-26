import { useMutation } from "@tanstack/react-query"
import { updateLoyaltyProgram } from "@/http/loyalty/update-loyalty-program"
import type { UpdateLoyaltyProgramRequest } from "@/lib/validations/loyalty-program"
import { queryClient } from "@/lib/react-query"

export function useUpdateLoyaltyProgram() {
  return useMutation<unknown, string, UpdateLoyaltyProgramRequest>({
    mutationFn: async inputs => {
      const { data, error } = await updateLoyaltyProgram(inputs)
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loyalty-program", variables.id],
      })
      queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] })
    },
  })
}
