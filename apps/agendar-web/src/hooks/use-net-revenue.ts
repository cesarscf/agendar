import { useQuery } from "@tanstack/react-query"
import type { GetNetRevenueParams } from "@/http/reports/get-net-revenue"
import { getNetRevenue } from "@/http/reports/get-net-revenue"
import { queryKeys } from "@/lib/query-keys"

// ========== QUERIES ==========

export function useNetRevenue(params: GetNetRevenueParams) {
  return useQuery({
    queryKey: queryKeys.netRevenue(params),
    queryFn: () => getNetRevenue(params),
  })
}
