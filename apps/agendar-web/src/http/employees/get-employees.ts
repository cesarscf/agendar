import { api } from "@/lib/api-client"
import type { Employee } from "@/lib/validations/employees"

export async function getEmployees() {
  const response = await api.get<Employee[]>("/employees")

  return response.data
}
