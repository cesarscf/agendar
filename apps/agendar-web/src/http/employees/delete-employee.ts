import { api } from "@/lib/api-client"

export async function deleteEmployee(employeeId: string) {
  await api.delete(`/employees/${employeeId}`)
}
