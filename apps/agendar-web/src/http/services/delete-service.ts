import { api } from "@/lib/api-client"

export async function deleteService(serviceId: string) {
  await api.delete(`/services/${serviceId}`)
}
