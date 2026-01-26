import { api } from "../api-client"
import type { Customer } from "@/lib/validations/customer"
import { handleApiError } from "@/utils"

export async function getCustomer(id: string) {
  try {
    const response = await api.get<Customer>(`/customers/${id}`)

    return {
      data: response.data,
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
