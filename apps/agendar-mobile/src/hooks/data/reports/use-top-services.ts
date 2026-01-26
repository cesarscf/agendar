import { useQuery } from "@tanstack/react-query"
import {
  getTopServices,
  type GetTopServicesParams,
  type GetTopServicesResponse,
} from "@/http/reports/get-top-services"

export function useTopServices(params: GetTopServicesParams) {
  return useQuery<GetTopServicesResponse, string>({
    queryKey: ["reports", "top-services", params],
    queryFn: async () => {
      const { data, error } = await getTopServices(params)
      if (error) throw error
      return data ?? { items: [] }
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  })
}
