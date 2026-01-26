import { useMutation } from "@tanstack/react-query"

import { deleteEmployeeRecurringBlock } from "@/http/employee/delete-employee-recurring-block"
import { queryClient } from "@/lib/react-query"

interface DeleteEmployeeRecurringBlockRequest {
  recurringBlockId: string
  employeeId: string
}

export function useDeleteEmployeeRecurringBlock() {
  return useMutation<boolean, string, DeleteEmployeeRecurringBlockRequest>({
    mutationFn: async ({ recurringBlockId }) => {
      const { data, error } =
        await deleteEmployeeRecurringBlock(recurringBlockId)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employee", variables.employeeId, "recurring-blocks"],
      })
    },
  })
}
