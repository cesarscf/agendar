import { useQuery } from "@tanstack/react-query";
import { getMonthlyServices } from "@/http/reports/get-monthly-services";
import { queryKeys } from "@/lib/query-keys";

// ========== QUERIES ==========

export function useMonthlyServices(params: { serviceId?: string }) {
  return useQuery({
    queryKey: queryKeys.monthlyServices(params),
    queryFn: () => getMonthlyServices(params),
  });
}
