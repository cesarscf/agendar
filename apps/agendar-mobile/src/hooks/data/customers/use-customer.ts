import { getCustomer } from "@/http/customers/get-customer"
import type { Customer } from "@/lib/validations/customer"
import { useQuery } from "@tanstack/react-query"

export function useCustomer(customerId: string) {
  return useQuery<Customer, string>({
    queryKey: ["customers", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await getCustomer(customerId)

      if (error) {
        throw error
      }

      return data!
    },
  })
}
