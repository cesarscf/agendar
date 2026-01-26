import { getCustomers } from "@/http/customers/get-customers"
import type { Customer } from "@/lib/validations/customer"
import { useQuery } from "@tanstack/react-query"

export function useCustomers() {
  return useQuery<Customer[], string>({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await getCustomers()

      if (error) {
        throw error
      }

      return data!
    },
  })
}
