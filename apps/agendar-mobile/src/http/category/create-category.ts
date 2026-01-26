import { api } from "../api-client"
import type { CreateCategoryRequest } from "@/lib/validations/category"
import { handleApiError } from "@/utils"

export async function createCategory(inpus: CreateCategoryRequest) {
  try {
    const createCategory = await api.post<{ id: string }>(`/categories`, {
      name: inpus.name,
    })

    return {
      data: createCategory.data,
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
