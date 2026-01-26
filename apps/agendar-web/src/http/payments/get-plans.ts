import { api } from "@/lib/api-client"
import type { Plan } from "@/lib/validations/plan"

export async function getPlans() {
  const response = await api.get<Plan[]>(`/plans`)

  return response.data
}
