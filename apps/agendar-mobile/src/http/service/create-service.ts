import { api } from "../api-client"
import type { CreateServiceRequest } from "@/lib/validations/service"
import { handleApiError } from "@/utils"
import { parseBRLToCents } from "@/utils/currency"

export async function createService(inputs: CreateServiceRequest) {
  try {
    const price = parseBRLToCents(inputs.price)

    await api.post("/services", {
      ...inputs,
      durationInMinutes: Number(inputs.durationInMinutes),
      price,
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
