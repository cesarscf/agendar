import { api } from "../api-client"
import type { Customer } from "@/lib/validations/customer"
import { handleApiError } from "@/utils"

export async function getCustomers() {
  try {
    const response = await api.get<Customer[]>(`/customers`)

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
