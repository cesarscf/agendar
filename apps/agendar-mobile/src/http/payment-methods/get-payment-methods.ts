import { api } from "../api-client"
import type { PaymentMethod } from "@/lib/validations/payment-method"
import { handleApiError } from "@/utils"

export async function getPaymentMethods() {
  try {
    const result = await api.get<PaymentMethod[]>("/payment-methods")

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
