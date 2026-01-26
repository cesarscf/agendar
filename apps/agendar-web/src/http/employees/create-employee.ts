import { api } from "@/lib/api-client"
import { onlyNumbers } from "@/lib/utils"

import type { CreateEmployeeRequest } from "@/lib/validations/employees"

export async function createEmployee(inputs: CreateEmployeeRequest) {
  const payload = {
    ...inputs,
    phone: inputs.phone ? onlyNumbers(inputs.phone) : undefined,
  }

  await api.post("/employees", payload)
}
