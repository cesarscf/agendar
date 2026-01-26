import { updateCustomer } from "@/http/customers/update-customer"

import { queryClient } from "@/lib/react-query"
import type { UpdateCustomerRequest } from "@/lib/validations/customer"

import { useMutation } from "@tanstack/react-query"

export function useUpdateCustomer() {
  return useMutation<boolean, string, UpdateCustomerRequest>({
    mutationFn: async inputs => {
      const { data, error } = await updateCustomer(inputs)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess(_, variables) {
      const customerId = variables.id

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })

      queryClient.invalidateQueries({
        queryKey: [customerId],
      })
    },
  })
}
