import { useQuery } from "@tanstack/react-query"
import type { GetEmployeeCommissionParams } from "@/http/reports/get-employee-commission"
import { getEmployeeCommission } from "@/http/reports/get-employee-commission"
import { queryKeys } from "@/lib/query-keys"

// ========== QUERIES ==========

export function useEmployeeCommission(params: GetEmployeeCommissionParams) {
  return useQuery({
    queryKey: queryKeys.employeeCommission(params),
    queryFn: () => getEmployeeCommission(params),
  })
}
