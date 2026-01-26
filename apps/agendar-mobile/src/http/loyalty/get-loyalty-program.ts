import { api } from "../api-client"
import type { LoyaltyProgram } from "@/lib/validations/loyalty-program"
import { handleApiError } from "@/utils"

export async function getLoyaltyProgram(id: string) {
  try {
    const result = await api.get<LoyaltyProgram>(`/loyalty-programs/${id}`)

    return {
      data: result.data,
      error: null,
    }
  } catch (err) {
    const { error } = handleApiError(err)

    return {
      data: null,
      error,
    }
  }
}
