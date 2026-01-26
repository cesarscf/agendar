import { api } from "@/lib/api-client";

import type { UpdateLoyaltyProgram } from "@/lib/validations/loyalty-program";

export async function updateLoyaltyProgram(inputs: UpdateLoyaltyProgram) {
  const payload = {
    ...inputs,
  };

  await api.put(`/loyalty-programs/${inputs.id}`, payload);
}
