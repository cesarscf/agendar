import { api } from "../api-client"
import type { UpdateServiceRequest } from "@/lib/validations/service"
import { handleApiError } from "@/utils"
import { parseBRLToCents } from "@/utils/currency"

export async function updateService(inputs: UpdateServiceRequest) {
  try {
    const payload: Record<string, unknown> = { ...inputs }

    if (inputs.price) {
      payload.price = parseBRLToCents(inputs.price)
    }

    if (inputs.durationInMinutes) {
      payload.durationInMinutes = Number(inputs.durationInMinutes)
    }

    await api.put(`/services/${inputs.id}`, payload)

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
