import { api } from "@/lib/api-client"
import { convertUnmaskedToCents, parseDuration } from "@/lib/utils"
import type { CreateServiceRequest } from "@/lib/validations/service"

export async function createService(inputs: CreateServiceRequest) {
  const payload = {
    ...inputs,
    durationInMinutes: parseDuration(inputs.durationInMinutes),
    price: convertUnmaskedToCents(inputs.price),
  }

  await api.post("/services", payload)
}
