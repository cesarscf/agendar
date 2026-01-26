import { useMutation } from "@tanstack/react-query"
import { createLoyaltyProgram } from "@/http/loyalty/create-loyalty-program"
import type { CreateLoyaltyProgramRequest } from "@/lib/validations/loyalty-program"
import { queryClient } from "@/lib/react-query"

export function useCreateLoyaltyProgram() {
  return useMutation<{ id: string }, string, CreateLoyaltyProgramRequest>({
    mutationFn: async inputs => {
      const { data, error } = await createLoyaltyProgram(inputs)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] })
    },
  })
}
