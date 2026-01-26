import { api } from "@/lib/api-client"
import type { LoyaltyProgram } from "@/lib/validations/loyalty-program"

export async function getLoyaltyPrograms() {
  const response = await api.get<LoyaltyProgram[]>("/loyalty-programs")

  return response.data
}
