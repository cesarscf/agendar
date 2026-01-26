import { useQuery } from "@tanstack/react-query"
import {
  type GetMonthlyServicesParams,
  type GetMonthlyServicesResponse,
  getMonthlyServices,
} from "@/http/reports/get-monthly-services"

export function useMonthlyServices(params?: GetMonthlyServicesParams) {
  return useQuery<GetMonthlyServicesResponse, string>({
    queryKey: ["reports", "monthly-services", params],
    queryFn: async () => {
      const { data, error } = await getMonthlyServices(params)
      if (error) throw error
      return data ?? { items: [] }
    },
    staleTime: 5 * 60 * 1000,
  })
}
