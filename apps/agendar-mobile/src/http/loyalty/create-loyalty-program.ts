import { api } from "../api-client"
import type { CreateLoyaltyProgramRequest } from "@/lib/validations/loyalty-program"
import { handleApiError } from "@/utils"

export async function createLoyaltyProgram(data: CreateLoyaltyProgramRequest) {
  try {
    const response = await api.post<{ id: string }>("/loyalty-programs", data)

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
