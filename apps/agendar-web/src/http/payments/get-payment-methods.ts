import { api } from "@/lib/api-client"
import type { PaymentMethod } from "@/lib/validations/payment-method"

export async function getPaymentMethods() {
  const response = await api.get<PaymentMethod[]>("/payment-methods")

  return response.data
}
