import { useQuery } from "@tanstack/react-query"
import { getPlans } from "@/http/plan/get-plans"
import type { Plan } from "@/lib/validations/plans"

export function usePlans() {
  return useQuery<Plan[], string>({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await getPlans()

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}
