import { useQuery } from "@tanstack/react-query"

import { getEmployees } from "@/http/employee/get-employees"
import type { Employee } from "@/lib/validations/employee"

export function useEmployees() {
  return useQuery<Employee[], string>({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await getEmployees()

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}
