import { useQuery } from "@tanstack/react-query"

import { getEmployeeRecurringBlocks } from "@/http/employee/get-employee-recurring-blocks"
import type { EmployeeRecurringBlock } from "@/lib/validations/blocks"

export function useEmployeeRecurringBlocks(employeeId: string) {
  return useQuery<EmployeeRecurringBlock[], string>({
    queryKey: ["employee", employeeId, "recurring-blocks"],
    queryFn: async () => {
      const { data, error } = await getEmployeeRecurringBlocks(employeeId)

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}
