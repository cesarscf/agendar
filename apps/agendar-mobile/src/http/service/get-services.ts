import type { Service } from "@/lib/validations/service"
import { handleApiError } from "@/utils"
import { api } from "../api-client"

export async function getServices() {
  try {
    const response = await api.get<Service[]>("/services")

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
