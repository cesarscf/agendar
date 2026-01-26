import { api } from "../api-client"
import type { UpdateCustomerRequest } from "@/lib/validations/customer"
import { handleApiError } from "@/utils"

export async function updateCustomer(inputs: UpdateCustomerRequest) {
  try {
    await api.put(`/customers/${inputs.id}`, {
      ...inputs,
    })

    return {
      data: true,
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
