import { api } from "@/lib/api-client"

export async function deleteCategory(categoryId: string) {
  await api.delete(`/categories/${categoryId}`)
}
