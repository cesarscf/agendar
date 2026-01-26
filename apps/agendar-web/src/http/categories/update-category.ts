import { api } from "@/lib/api-client";

import type { UpdateCategoryRequest } from "@/lib/validations/category";

export async function updateCategory(inputs: UpdateCategoryRequest) {
  const payload = {
    ...inputs,
  };

  await api.put(`/categories/${payload.id}`, payload);
}
