import { api } from "@/lib/api-client"
import type { Category } from "@/lib/validations/category"

export async function getCategories() {
  const response = await api.get<Category[]>("/categories")

  return response.data
}
