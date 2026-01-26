import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type MostBookedServiceItem = {
  service: string
  totalBookings: number
}

export type GetMostBookedServicesResponse = {
  items: MostBookedServiceItem[]
}

export type GetMostBookedServicesParams = {
  startDate: string
  endDate: string
}

export async function getMostBookedServices(
  params: GetMostBookedServicesParams
) {
  try {
    const result = await api.get<GetMostBookedServicesResponse>(
      "/establishments/most-booked-services",
      { params }
    )

    return {
      data: result.data,
      error: null,
    }
  } catch (err) {
    const { error } = handleApiError(err)

    return {
      data: null,
      error,
    }
  }
}
