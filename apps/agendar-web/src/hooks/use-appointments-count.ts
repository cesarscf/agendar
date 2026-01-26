import { useQuery } from "@tanstack/react-query";
import type { GetAppointmentsMetricsParams } from "@/http/reports/get-appointments-metrics";
import { getAppointmentsMetrics } from "@/http/reports/get-appointments-metrics";
import { queryKeys } from "@/lib/query-keys";

// ========== QUERIES ==========

export function useAppointmentsCount(params: GetAppointmentsMetricsParams) {
  return useQuery({
    queryKey: queryKeys.appointmentsCount(params),
    queryFn: () => getAppointmentsMetrics(params),
  });
}
