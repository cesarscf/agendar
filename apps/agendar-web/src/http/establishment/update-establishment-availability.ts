import { api } from "@/lib/api-client"
import type { UpdateAvailabilityRequest } from "@/lib/validations/availability"

export async function updateEstablishmentAvailability(
  inputs: UpdateAvailabilityRequest
) {
  const payload = {
    ...inputs,
  }

  await api.post("/establishments/availability", payload)
}
