import { api } from "@/lib/api-client";

import type { CreateEmployeeBlockRequest } from "@/lib/validations/blocks";

export async function createEmployeeBlock(
  inputs: CreateEmployeeBlockRequest & { employeeId: string },
) {
  const payload = {
    ...inputs,
    startsAt: inputs.startsAt,
    endsAt: inputs.endsAt,
  };

  await api.post(`/employees/${inputs.employeeId}/blocks`, payload);
}
