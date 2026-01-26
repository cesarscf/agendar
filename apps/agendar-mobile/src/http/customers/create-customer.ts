import { api } from "../api-client"
import type { CreateCustomerRequest } from "@/lib/validations/customer"
import { handleApiError } from "@/utils"

export async function createCustomer(inputs: CreateCustomerRequest) {
  try {
    const customerData = await api.post<{ id: string }>("/customers", {
      ...inputs,
    })

    return {
      data: customerData.data,
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
