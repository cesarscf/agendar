import type { UpdateAvailabilityRequest } from "@/lib/validations/availability"
import { api } from "../api-client"

export async function updateEstablishmentAvailability(
  inputs: UpdateAvailabilityRequest
) {
  const payload = {
    ...inputs,
  }

  await api.post("/establishments/availability", payload)
}
