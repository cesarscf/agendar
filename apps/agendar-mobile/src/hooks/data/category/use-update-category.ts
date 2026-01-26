import { useMutation } from "@tanstack/react-query"
import { updateCategory } from "@/http/category/update-category"
import { queryClient } from "@/lib/react-query"
import type { UpdateCategoryRequest } from "@/lib/validations/category"

export function useUpdateCategory() {
  return useMutation<boolean, string, UpdateCategoryRequest>({
    mutationFn: async inputs => {
      const { data, error } = await updateCategory(inputs)
      if (error) throw error
      return data!
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories", variables.id] })
    },
  })
}
