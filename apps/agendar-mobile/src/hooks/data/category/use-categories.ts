import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/http/category/get-categories"
import type { Category } from "@/lib/validations/category"

export function useCategories() {
  return useQuery<Category[], string>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await getCategories()
      if (error) throw error
      return data ?? []
    },
  })
}
