import { useQuery } from "@tanstack/react-query"
import type { GetMostBookedServicesParams } from "@/http/reports/get-most-booked-services"
import { getMostBookedServices } from "@/http/reports/get-most-booked-services"
import { queryKeys } from "@/lib/query-keys"

// ========== QUERIES ==========

export function useMostBookedServices(params: GetMostBookedServicesParams) {
  return useQuery({
    queryKey: queryKeys.mostBookedServices(params),
    queryFn: () => getMostBookedServices(params),
  })
}
