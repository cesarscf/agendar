import { useQuery } from "@tanstack/react-query"
import {
  type GetServicesByEmployeeParams,
  type GetServicesByEmployeeResponse,
  getServicesByEmployee,
} from "@/http/reports/get-services-by-employee"

export function useServicesByEmployee(params: GetServicesByEmployeeParams) {
  return useQuery<GetServicesByEmployeeResponse, string>({
    queryKey: ["reports", "services-by-employee", params],
    queryFn: async () => {
      const { data, error } = await getServicesByEmployee(params)
      if (error) throw error
      return data ?? { items: [] }
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  })
}
