import { api } from "../api-client"
import type { Establishment } from "@/lib/validations/establishment"
import { handleApiError } from "@/utils"

export async function getEstablishment() {
  try {
    const response = await api.get<Establishment>(`/establishments`)

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
