import { handleApiError } from "@/utils"
import { api } from "../api-client"

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
