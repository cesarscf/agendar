import { useQuery } from "@tanstack/react-query"
import { getLoyaltyPrograms } from "@/http/loyalty/get-loyalty-programs"
import type { LoyaltyProgram } from "@/lib/validations/loyalty-program"

export function useLoyaltyPrograms() {
  return useQuery<LoyaltyProgram[], string>({
    queryKey: ["loyalty-programs"],
    queryFn: async () => {
      const { data, error } = await getLoyaltyPrograms()
      if (error) throw error
      return data ?? []
    },
  })
}
