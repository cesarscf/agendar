import { api } from "@/lib/api-client"

import type { CreateLoyaltyProgram } from "@/lib/validations/loyalty-program"

export async function createLoyaltyProgram(inputs: CreateLoyaltyProgram) {
  const payload = {
    ...inputs,
  }

  await api.post("/loyalty-programs", payload)
}
