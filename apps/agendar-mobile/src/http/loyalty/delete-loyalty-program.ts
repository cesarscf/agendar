import { api } from "../api-client"
import { handleApiError } from "@/utils"

export async function deleteLoyaltyProgram(id: string) {
  try {
    const response = await api.delete(`/loyalty-programs/${id}/permanent`)

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
