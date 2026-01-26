import { useQuery } from "@tanstack/react-query"
import {
  getAverageTicket,
  type GetAverageTicketParams,
  type GetAverageTicketResponse,
} from "@/http/reports/get-average-ticket"

export function useAverageTicket(params: GetAverageTicketParams) {
  return useQuery<GetAverageTicketResponse, string>({
    queryKey: ["reports", "average-ticket", params],
    queryFn: async () => {
      const { data, error } = await getAverageTicket(params)
      if (error) throw error
      return data ?? { value: 0 }
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  })
}
