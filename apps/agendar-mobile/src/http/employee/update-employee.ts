import type { UpdateEmployeeRequest } from "@/lib/validations/employee"
import { handleApiError } from "@/utils"
import { api } from "../api-client"

export async function updateEmployee(inputs: UpdateEmployeeRequest) {
  try {
    await api.put(`/employees/${inputs.id}`, {
      ...inputs,
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
