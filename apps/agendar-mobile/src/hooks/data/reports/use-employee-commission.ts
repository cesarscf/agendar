import { useQuery } from "@tanstack/react-query"
import {
  type GetEmployeeCommissionParams,
  type GetEmployeeCommissionResponse,
  getEmployeeCommission,
} from "@/http/reports/get-employee-commission"

export function useEmployeeCommission(params: GetEmployeeCommissionParams) {
  return useQuery<GetEmployeeCommissionResponse, string>({
    queryKey: ["reports", "employee-commission", params],
    queryFn: async () => {
      const { data, error } = await getEmployeeCommission(params)
      if (error) throw error
      return data ?? { items: [] }
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  })
}
