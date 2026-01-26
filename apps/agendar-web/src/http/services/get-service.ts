import { api } from "@/lib/api-client"
import type { Service } from "@/lib/validations/service"

export async function getService(serviceId: string) {
  const response = await api.get<Service>(`/services/${serviceId}`)

  return response.data
}
