import { useQuery } from "@tanstack/react-query"
import {
  getTopPaymentMethods,
  type GetTopPaymentMethodsParams,
  type GetTopPaymentMethodsResponse,
} from "@/http/reports/get-top-payment-methods"

export function useTopPaymentMethods(params: GetTopPaymentMethodsParams) {
  return useQuery<GetTopPaymentMethodsResponse, string>({
    queryKey: ["reports", "top-payment-methods", params],
    queryFn: async () => {
      const { data, error } = await getTopPaymentMethods(params)
      if (error) throw error
      return data ?? { items: [] }
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  })
}
