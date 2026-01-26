import { useQuery } from "@tanstack/react-query";
import type { GetTopServicesParams } from "@/http/reports/get-top-services";
import { getTopServices } from "@/http/reports/get-top-services";
import { queryKeys } from "@/lib/query-keys";

// ========== QUERIES ==========

export function useTopServices(params: GetTopServicesParams) {
  return useQuery({
    queryKey: queryKeys.topServices(params),
    queryFn: () => getTopServices(params),
  });
}
