import { useQuery } from "@tanstack/react-query";
import type { GetTopPaymentMethodsParams } from "@/http/reports/get-top-payment-methods";
import { getTopPaymentMethods } from "@/http/reports/get-top-payment-methods";
import { queryKeys } from "@/lib/query-keys";

// ========== QUERIES ==========

export function useTopPaymentMethods(params: GetTopPaymentMethodsParams) {
  return useQuery({
    queryKey: queryKeys.topPaymentMethods(params),
    queryFn: () => getTopPaymentMethods(params),
  });
}
