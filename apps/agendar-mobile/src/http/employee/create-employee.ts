import type { CreateEmployeeRequest } from "@/lib/validations/employee"
import { handleApiError } from "@/utils"
import { api } from "../api-client"

export async function createEmployee(inputs: CreateEmployeeRequest) {
  try {
    await api.post("/employees", {
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
