import { api } from "../api-client"
import type { Employee } from "@/lib/validations/employee"
import { handleApiError } from "@/utils"

export async function getEmployee(employeeId: string) {
  try {
    const response = await api.get<Employee>(`/employees/${employeeId}`)

    return {
      data: response.data,
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
