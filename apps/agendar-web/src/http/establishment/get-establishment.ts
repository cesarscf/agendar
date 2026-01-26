import { api } from "@/lib/api-client"
import type { Establishment } from "@/lib/validations/establishment"

export async function getEstablishment() {
  const response = await api.get<Establishment>("/establishments")

  return response.data
}
