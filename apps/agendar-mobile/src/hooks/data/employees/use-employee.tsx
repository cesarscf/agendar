import { useQuery } from "@tanstack/react-query"

import { getEmployee } from "@/http/employee/get-employee"
import type { Employee } from "@/lib/validations/employee"

export function useEmployee(employeeId: string) {
  return useQuery<Employee, string>({
    queryKey: ["employees", employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      const { data, error } = await getEmployee(employeeId)

      if (error) {
        throw error
      }

      return data!
    },
  })
}
