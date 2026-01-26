import { useMutation } from "@tanstack/react-query"

import { createEmployeeRecurringBlock } from "@/http/employee/create-employee-recurring-block"
import { queryClient } from "@/lib/react-query"

interface CreateEmployeeRecurringBlockRequest {
  employeeId: string
  weekday: number
  startTime: string
  endTime: string
  reason: string
}

export function useCreateEmployeeRecurringBlock() {
  return useMutation<boolean, string, CreateEmployeeRecurringBlockRequest>({
    mutationFn: async inputs => {
      const { data, error } = await createEmployeeRecurringBlock(inputs)

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
