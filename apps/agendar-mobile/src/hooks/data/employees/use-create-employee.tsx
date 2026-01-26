import { createEmployee } from "@/http/employee/create-employee"
import { queryClient } from "@/lib/react-query"
import type { CreateEmployeeRequest } from "@/lib/validations/employee"
import { useMutation } from "@tanstack/react-query"

export function useCreateEmployee() {
  return useMutation<boolean, string, CreateEmployeeRequest>({
    mutationFn: async inputs => {
      const { data, error } = await createEmployee(inputs)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      })
    },
  })
}
