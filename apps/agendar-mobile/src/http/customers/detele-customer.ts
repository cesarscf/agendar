import { api } from "../api-client"
import { handleApiError } from "@/utils"

export async function deleteCustomer(id: string) {
  try {
    await api.delete(`/customers/${id}`)

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
