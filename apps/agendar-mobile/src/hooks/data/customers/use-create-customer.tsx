import { useMutation } from "@tanstack/react-query"
import { createCustomer } from "@/http/customers/create-customer"
import { queryClient } from "@/lib/react-query"
import type { CreateCustomerRequest } from "@/lib/validations/customer"

export function useCreateCustomer() {
  return useMutation<{ id: string }, string, CreateCustomerRequest>({
    mutationFn: async inputs => {
      const { data, error } = await createCustomer(inputs)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
    },
  })
}
