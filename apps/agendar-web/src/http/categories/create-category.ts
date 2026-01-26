import { api } from "@/lib/api-client";

import type { CreateCategoryRequest } from "@/lib/validations/category";

export async function createCategory(inputs: CreateCategoryRequest) {
  const payload = {
    ...inputs,
  };

  await api.post("/categories", payload);
}
