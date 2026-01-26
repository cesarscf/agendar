import { useQuery } from "@tanstack/react-query"
import type { GetAverageTicketParams } from "@/http/reports/get-average-ticket"
import { getAverageTicket } from "@/http/reports/get-average-ticket"
import { queryKeys } from "@/lib/query-keys"

// ========== QUERIES ==========

export function useAverageTicket(params: GetAverageTicketParams) {
  return useQuery({
    queryKey: queryKeys.averageTicket(params),
    queryFn: () => getAverageTicket(params),
  })
}
