import type { Category } from "@/lib/validations/category"
import { handleApiError } from "@/utils"
import { api } from "../api-client"

export async function getCategories() {
  try {
    const result = await api.get<Category[]>("/categories")

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
