import { api } from "../api-client"
import { handleApiError } from "@/utils"

export async function deleteService(id: string) {
  try {
    await api.delete<{ id: string }>(`/services/${id}`)

    return {
      data: true,
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
