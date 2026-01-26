import { updateEmployeeServices } from "@/http/employee/update-employee-services"

import { queryClient } from "@/lib/react-query"
import type { UpdateEmployeeServicesRequest } from "@/lib/validations/employee"

import { useMutation } from "@tanstack/react-query"

export function useUpdateEmployeeServices() {
  return useMutation<boolean, string, UpdateEmployeeServicesRequest>({
    mutationFn: async inputs => {
      const { data, error } = await updateEmployeeServices(inputs)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess(_, variables) {
      const employeeId = variables.employeeId

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      })

      queryClient.invalidateQueries({
        queryKey: ["employees", employeeId],
      })
    },
  })
}
