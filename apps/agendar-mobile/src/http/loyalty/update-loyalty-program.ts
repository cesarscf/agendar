import { api } from "../api-client"
import type { UpdateLoyaltyProgramRequest } from "@/lib/validations/loyalty-program"
import { handleApiError } from "@/utils"

export async function updateLoyaltyProgram(data: UpdateLoyaltyProgramRequest) {
  try {
    const response = await api.put(`/loyalty-programs/${data.id}`, data)

    return {
      data: response.data,
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
