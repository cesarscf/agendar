import { useQuery } from "@tanstack/react-query"
import { getLoyaltyProgram } from "@/http/loyalty/get-loyalty-program"
import type { LoyaltyProgram } from "@/lib/validations/loyalty-program"

export function useLoyaltyProgram(id: string) {
  return useQuery<LoyaltyProgram | null, string>({
    queryKey: ["loyalty-program", id],
    queryFn: async () => {
      const { data, error } = await getLoyaltyProgram(id)
      if (error) throw error
      return data
    },
  })
}
