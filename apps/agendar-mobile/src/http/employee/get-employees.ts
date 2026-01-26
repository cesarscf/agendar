import { api } from "../api-client"
import type { Employee } from "@/lib/validations/employee"
import { handleApiError } from "@/utils"

export async function getEmployees() {
  try {
    const response = await api.get<Employee[]>("/employees")

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
