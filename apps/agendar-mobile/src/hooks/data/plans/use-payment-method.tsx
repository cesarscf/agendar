import { useQuery } from "@tanstack/react-query"
import { getPaymentMethods } from "@/http/payment-methods/get-payment-methods"
import type { PaymentMethod } from "@/lib/validations/payment-method"

export function usePaymentMethods() {
  return useQuery<PaymentMethod[], string>({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const { data, error } = await getPaymentMethods()

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}
