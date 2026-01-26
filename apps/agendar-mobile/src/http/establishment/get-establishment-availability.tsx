import type { Availability } from "@/lib/validations/availability"
import { api } from "../api-client"

export async function getEstablishmentAvailability() {
  const response = await api.get<Availability[]>("/establishments/availability")

  return response.data
}
