import { handleApiError } from "@/utils"
import { api } from "../api-client"

export async function deletePackage(id: string) {
  try {
    await api.delete<{ id: string }>(`/packages/${id}`)

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
