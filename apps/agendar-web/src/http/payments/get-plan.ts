import { api } from "@/lib/api-client"
import type { Plan } from "@/lib/validations/plan"

export async function getPlan(planId: string) {
  const response = await api.get<Plan>(`/plans/${planId}`)

  return response.data
}
