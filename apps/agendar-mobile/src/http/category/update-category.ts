import { api } from "../api-client"
import type { UpdateCategoryRequest } from "@/lib/validations/category"
import { handleApiError } from "@/utils"

export async function updateCategory(inputs: UpdateCategoryRequest) {
  try {
    await api.put(`/categories/${inputs.id}`, {
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
