import { api } from "../api-client"
import { handleApiError } from "@/utils"

export async function deleteEmployeeBlock(blockId: string) {
  try {
    await api.delete(`/blocks/${blockId}`)

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
