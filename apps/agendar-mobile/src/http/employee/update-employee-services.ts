import { api } from "../api-client"
import type { UpdateEmployeeServicesRequest } from "@/lib/validations/employee"
import { handleApiError } from "@/utils"

export async function updateEmployeeServices(
  inputs: UpdateEmployeeServicesRequest
) {
  try {
    await api.post(`/employees/${inputs.employeeId}/services`, {
      services: inputs.services ?? [],
    })

    return {
      data: true,
      error: null,
    }
  } catch (err) {
    const { error } = handleApiError(err)

    return {
      data: null,
      error,
    }
  }
}
