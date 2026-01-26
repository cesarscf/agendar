import { useMutation } from "@tanstack/react-query"

import { deleteEmployeeBlock } from "@/http/employee/delete-employee-block"
import { queryClient } from "@/lib/react-query"

interface DeleteEmployeeBlockRequest {
  blockId: string
  employeeId: string
}

export function useDeleteEmployeeBlock() {
  return useMutation<boolean, string, DeleteEmployeeBlockRequest>({
    mutationFn: async ({ blockId }) => {
      const { data, error } = await deleteEmployeeBlock(blockId)

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
