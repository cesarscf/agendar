import { useMutation } from "@tanstack/react-query"
import { deleteCategory } from "@/http/category/delete-category"
import { queryClient } from "@/lib/react-query"

export function useDeleteCategory() {
  return useMutation<boolean, string, string>({
    mutationFn: async id => {
      const { data, error } = await deleteCategory(id)
      if (error) throw error
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
