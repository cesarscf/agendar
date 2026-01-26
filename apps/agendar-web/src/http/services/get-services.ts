import { api } from "@/lib/api-client"
import type { Service } from "@/lib/validations/service"

export async function getServices() {
  const response = await api.get<Service[]>("/services")

  return response.data
}
