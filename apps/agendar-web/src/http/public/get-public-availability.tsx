import { api } from "@/lib/api-client"

export type AvailabilityParams = {
  date: string
  employeeId: string
  serviceId: string
  establishmentId: string
}

export type GetAvailabilityResponse = {
  items: string[]
}

export async function getAvailability(params: AvailabilityParams) {
  const response = await api.get<GetAvailabilityResponse>("/availability", {
    params,
  })

  return response.data.items
}
