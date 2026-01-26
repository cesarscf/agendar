import { api } from "../api-client"
import type { UpdateEstablishmentRequest } from "@/lib/validations/establishment"
import { handleApiError } from "@/utils"

export async function updateEstablishment(inputs: UpdateEstablishmentRequest) {
  try {
    await api.put<boolean>(`/establishments`, {
      ...inputs,
    })

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
