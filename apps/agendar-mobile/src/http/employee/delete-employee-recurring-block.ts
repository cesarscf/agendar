import { api } from "../api-client"
import { handleApiError } from "@/utils"

export async function deleteEmployeeRecurringBlock(recurringBlockId: string) {
  try {
    await api.delete(`/recurring-blocks/${recurringBlockId}`)

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
