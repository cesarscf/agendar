import { useQuery } from "@tanstack/react-query"
import {
  getAppointmentsMetrics,
  type GetAppointmentsMetricsParams,
  type GetAppointmentsMetricsResponse,
} from "@/http/reports/get-appointments-metrics"

export function useAppointmentsMetrics(params: GetAppointmentsMetricsParams) {
  return useQuery<GetAppointmentsMetricsResponse, string>({
    queryKey: ["reports", "appointments-metrics", params],
    queryFn: async () => {
      const { data, error } = await getAppointmentsMetrics(params)
      if (error) throw error
      return data ?? { appointmentsCount: 0, value: 0 }
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  })
}
