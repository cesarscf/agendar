import { useQuery } from "@tanstack/react-query"
import {
  getDailyRevenue,
  type GetDailyRevenueParams,
  type GetDailyRevenueResponse,
} from "@/http/reports/get-daily-revenue"

export function useDailyRevenue(params: GetDailyRevenueParams) {
  return useQuery<GetDailyRevenueResponse, string>({
    queryKey: ["reports", "daily-revenue", params],
    queryFn: async () => {
      const { data, error } = await getDailyRevenue(params)
      if (error) throw error
      return data ?? { items: [] }
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  })
}
