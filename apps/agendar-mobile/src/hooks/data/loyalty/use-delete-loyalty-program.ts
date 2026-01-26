import { useMutation } from "@tanstack/react-query"
import { deleteLoyaltyProgram } from "@/http/loyalty/delete-loyalty-program"
import { queryClient } from "@/lib/react-query"

export function useDeleteLoyaltyProgram() {
  return useMutation<unknown, string, string>({
    mutationFn: async (id: string) => {
      const { data, error } = await deleteLoyaltyProgram(id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] })
    },
  })
}
