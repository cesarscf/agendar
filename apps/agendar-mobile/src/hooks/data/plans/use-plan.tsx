import { useQuery } from "@tanstack/react-query"

import type { Plan } from "@/lib/validations/plans"
import { getPlan } from "@/http/plan/get-plan"

export function usePlan(planId: string) {
  return useQuery<Plan, string>({
    queryKey: ["plans", planId],
    enabled: !!planId,
    queryFn: async () => {
      const { data, error } = await getPlan(planId)

      if (error) {
        throw error
      }

      return data!
    },
  })
}
