import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/react-query"
import { deleteCustomer } from "@/http/customers/detele-customer"

export function useDeleteCustomer() {
  return useMutation<boolean, string, string>({
    mutationFn: async id => {
      const { data, error } = await deleteCustomer(id)
      if (error) throw error
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
  })
}
