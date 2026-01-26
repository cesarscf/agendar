import { api } from "@/lib/api-client";
import type { UpdateEmployeeServicesForm } from "@/lib/validations/employees";

export async function updateEmployeeServices(
  inputs: UpdateEmployeeServicesForm,
) {
  await api.post(`/employees/${inputs.employeeId}/services`, {
    ...inputs,
  });
}
