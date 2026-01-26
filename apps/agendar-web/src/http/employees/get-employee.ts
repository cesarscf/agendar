import { api } from "@/lib/api-client";
import type { Employee } from "@/lib/validations/employees";

export async function getEmployee(employeeId: string) {
  const response = await api.get<Employee>(`/employees/${employeeId}`);

  return response.data;
}
