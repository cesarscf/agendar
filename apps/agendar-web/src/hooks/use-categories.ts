import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createCategory } from "@/http/categories/create-category"
import { deleteCategory } from "@/http/categories/delete-category"
import { getCategories } from "@/http/categories/get-categories"
import { updateCategory } from "@/http/categories/update-category"
import { queryKeys } from "@/lib/query-keys"
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/lib/validations/category"

// ========== QUERIES ==========

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
  })
}

// ========== MUTATIONS ==========

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}
