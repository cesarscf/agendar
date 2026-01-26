import { api } from "@/lib/api-client"
import type { Customer } from "@/lib/validations/customer"

export async function getCustomer(customerId: string) {
  const response = await api.get<Customer>(`/customers/${customerId}`)

  return response.data
}
