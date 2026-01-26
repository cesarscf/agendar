import { useMutation } from "@tanstack/react-query"
import { createCategory } from "@/http/category/create-category"
import { queryClient } from "@/lib/react-query"
import type { CreateCategoryRequest } from "@/lib/validations/category"

export function useCreateCategory() {
  return useMutation<{ id: string }, string, CreateCategoryRequest>({
    mutationFn: async inputs => {
      const { data, error } = await createCategory(inputs)
      if (error) throw error
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
