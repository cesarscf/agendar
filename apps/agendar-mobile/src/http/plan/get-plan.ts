import { api } from "../api-client"
import type { Plan } from "@/lib/validations/plans"
import { handleApiError } from "@/utils"

export async function getPlan(planId: string) {
  try {
    const response = await api.get<Plan>(`/plans/${planId}`)

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
