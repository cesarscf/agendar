import { useQuery } from "@tanstack/react-query"
import {
  getCustomerLoyaltyPrograms,
  type CustomerLoyaltyProgram,
} from "@/http/customers/get-customer-loyalty-programs"

export function useCustomerLoyaltyPrograms(customerPhone: string) {
  return useQuery<CustomerLoyaltyProgram[], string>({
    queryKey: ["customer-loyalty-programs", customerPhone],
    enabled: !!customerPhone,
    queryFn: async () => {
      const { data, error } = await getCustomerLoyaltyPrograms(customerPhone)

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}
