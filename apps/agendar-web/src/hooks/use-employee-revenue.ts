import { useQuery } from "@tanstack/react-query";
import type { GetEmployeeCommissionParams } from "@/http/reports/get-employee-revenue";
import { getEmployeeRevenue } from "@/http/reports/get-employee-revenue";
import { queryKeys } from "@/lib/query-keys";

// ========== QUERIES ==========

export function useEmployeeRevenue(params: GetEmployeeCommissionParams) {
  return useQuery({
    queryKey: queryKeys.employeeRevenue(params),
    queryFn: () => getEmployeeRevenue(params),
  });
}
