import { api } from "../api-client"
import { handleApiError } from "@/utils"

export async function desactiveLoyaltyProgram(id: string) {
  try {
    const response = await api.delete(`/loyalty-programs/${id}`)

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
