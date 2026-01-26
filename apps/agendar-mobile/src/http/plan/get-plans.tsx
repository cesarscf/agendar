import { api } from "../api-client"
import type { Plan } from "@/lib/validations/plans"
import { handleApiError } from "@/utils"

export async function getPlans() {
  try {
    const response = await api.get<Plan[]>("/plans")

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
