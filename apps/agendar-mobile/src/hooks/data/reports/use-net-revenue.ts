import { useQuery } from "@tanstack/react-query"
import {
  getNetRevenue,
  type GetNetRevenueParams,
  type GetNetRevenueResponse,
} from "@/http/reports/get-net-revenue"

export function useNetRevenue(params: GetNetRevenueParams) {
  return useQuery<GetNetRevenueResponse, string>({
    queryKey: ["reports", "net-revenue", params],
    queryFn: async () => {
      const { data, error } = await getNetRevenue(params)
      if (error) throw error
      return data ?? { value: 0 }
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  })
}
