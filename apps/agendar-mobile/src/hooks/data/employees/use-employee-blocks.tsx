import { useQuery } from "@tanstack/react-query"

import { getEmployeeBlocks } from "@/http/employee/get-employee-blocks"
import type { EmployeeBlock } from "@/lib/validations/blocks"

export function useEmployeeBlocks(employeeId: string) {
  return useQuery<EmployeeBlock[], string>({
    queryKey: ["employee", employeeId, "blocks"],
    queryFn: async () => {
      const { data, error } = await getEmployeeBlocks(employeeId)

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}
