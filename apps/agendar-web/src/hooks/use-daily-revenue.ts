import { useQuery } from "@tanstack/react-query";
import type { GetDailyRevenueParams } from "@/http/reports/get-daily-revenue";
import { getDailyRevenue } from "@/http/reports/get-daily-revenue";
import { queryKeys } from "@/lib/query-keys";

// ========== QUERIES ==========

export function useDailyRevenue(params: GetDailyRevenueParams) {
  return useQuery({
    queryKey: queryKeys.dailyRevenue(params),
    queryFn: () => getDailyRevenue(params),
  });
}
