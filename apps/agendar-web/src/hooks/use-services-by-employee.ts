import { useQuery } from "@tanstack/react-query"
import type { GetServicesByEmployeeParams } from "@/http/reports/get-services-by-employee"
import { getServicesByEmployee } from "@/http/reports/get-services-by-employee"
import { queryKeys } from "@/lib/query-keys"

// ========== QUERIES ==========

export function useServicesByEmployee(params: GetServicesByEmployeeParams) {
  return useQuery({
    queryKey: queryKeys.servicesByEmployee(params),
    queryFn: () => getServicesByEmployee(params),
  })
}
