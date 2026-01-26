import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type GetAverageTicketResponse = {
  value: number
}

export type GetAverageTicketParams = {
  startDate: string
  endDate: string
}

export async function getAverageTicket(params: GetAverageTicketParams) {
  try {
    const result = await api.get<GetAverageTicketResponse>(
      "/establishments/average-ticket",
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
