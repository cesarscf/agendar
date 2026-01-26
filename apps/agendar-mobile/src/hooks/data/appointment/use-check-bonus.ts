import { useQuery } from "@tanstack/react-query"
import {
  checkBonus,
  type CheckBonusParams,
} from "@/http/appointments/check-bonus"
import type { BonusData } from "@/lib/validations/checkin"

export function useCheckBonus(params: CheckBonusParams, enabled = true) {
  return useQuery<BonusData, Error>({
    queryKey: ["check-bonus", params.customerId, params.serviceId],
    enabled,
    queryFn: async () => {
      const { data, error } = await checkBonus(params)

      if (error) {
        throw new Error(error)
      }

      return data!
    },
  })
}
