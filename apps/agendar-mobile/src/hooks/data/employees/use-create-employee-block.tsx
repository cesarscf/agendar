import { useMutation } from "@tanstack/react-query"

import { createEmployeeBlock } from "@/http/employee/create-employee-block"
import { queryClient } from "@/lib/react-query"

interface CreateEmployeeBlockRequest {
  employeeId: string
  startsAt: Date
  endsAt: Date
  reason: string
}

export function useCreateEmployeeBlock() {
  return useMutation<boolean, string, CreateEmployeeBlockRequest>({
    mutationFn: async inputs => {
      const { data, error } = await createEmployeeBlock(inputs)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employee", variables.employeeId, "blocks"],
      })
    },
  })
}
