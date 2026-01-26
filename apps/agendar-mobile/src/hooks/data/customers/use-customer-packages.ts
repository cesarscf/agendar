import { useQuery } from "@tanstack/react-query"
import {
  getCustomerPackages,
  type CustomerPackage,
} from "@/http/customers/get-customer-packages"

export function useCustomerPackages(customerId: string) {
  return useQuery<CustomerPackage[], string>({
    queryKey: ["customer-packages", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await getCustomerPackages(customerId)

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}
