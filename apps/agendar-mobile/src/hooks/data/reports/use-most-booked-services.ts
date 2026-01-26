import { useQuery } from "@tanstack/react-query"
import {
  getMostBookedServices,
  type GetMostBookedServicesParams,
  type GetMostBookedServicesResponse,
} from "@/http/reports/get-most-booked-services"

export function useMostBookedServices(params: GetMostBookedServicesParams) {
  return useQuery<GetMostBookedServicesResponse, string>({
    queryKey: ["reports", "most-booked-services", params],
    queryFn: async () => {
      const { data, error } = await getMostBookedServices(params)
      if (error) throw error
      return data ?? { items: [] }
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  })
}
