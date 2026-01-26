import { useQuery } from "@tanstack/react-query"
import {
  getEmployeeRevenue,
  type GetEmployeeRevenueParams,
  type GetEmployeeRevenueResponse,
} from "@/http/reports/get-employee-revenue"

export function useEmployeeRevenue(params: GetEmployeeRevenueParams) {
  return useQuery<GetEmployeeRevenueResponse, string>({
    queryKey: ["reports", "employee-revenue", params],
    queryFn: async () => {
      const { data, error } = await getEmployeeRevenue(params)
      if (error) throw error
      return data ?? { items: [] }
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  })
}
