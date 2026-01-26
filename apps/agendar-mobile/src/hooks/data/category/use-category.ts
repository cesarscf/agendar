import { useQuery } from "@tanstack/react-query"
import { getCategory } from "@/http/category/get-category"
import type { Category } from "@/lib/validations/category"

export function useCategory(categoryId: string) {
  return useQuery<Category, string>({
    queryKey: ["categories", categoryId],
    enabled: !!categoryId,
    queryFn: async () => {
      const { data, error } = await getCategory(categoryId)
      if (error) throw error
      return data!
    },
  })
}
