import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type TopPaymentMethodItem = {
  method: string
  usage: number
}

export type GetTopPaymentMethodsResponse = {
  items: TopPaymentMethodItem[]
}

export type GetTopPaymentMethodsParams = {
  startDate: string
  endDate: string
}

export async function getTopPaymentMethods(params: GetTopPaymentMethodsParams) {
  try {
    const result = await api.get<GetTopPaymentMethodsResponse>(
      "/establishments/top-payment-methods",
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
