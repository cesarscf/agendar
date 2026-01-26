import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/react-query"
import type { UpdateCategoryRequest } from "@/lib/validations/category"
import { updateCategory } from "@/http/category/update-category"

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
