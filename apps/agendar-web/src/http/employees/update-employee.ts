import { api } from "@/lib/api-client"
import { onlyNumbers } from "@/lib/utils"
import type { UpdateEmployeeRequest } from "@/lib/validations/employees"

export async function updateEmployee(inputs: UpdateEmployeeRequest) {
  const payload = {
    ...inputs,
    phone: inputs.phone ? onlyNumbers(inputs.phone) : undefined,
  }

  await api.put(`/employees/${payload.id}`, payload)
}
