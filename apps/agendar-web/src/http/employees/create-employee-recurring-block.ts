import { api } from "@/lib/api-client"

import type { CreateEmployeeRecurringBlockRequest } from "@/lib/validations/blocks"

export async function createEmployeeRecurringBlock(
  inputs: CreateEmployeeRecurringBlockRequest & { employeeId: string }
) {
  const payload = {
    ...inputs,
  }

  await api.post(`/employees/${inputs.employeeId}/recurring-blocks`, payload)
}
