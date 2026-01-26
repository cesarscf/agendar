import { z } from "zod"

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const createCategorySchema = categorySchema.omit({ id: true })

export type Category = z.infer<typeof categorySchema>
export type CreateCategoryRequest = z.infer<typeof createCategorySchema>
export type UpdateCategoryRequest = z.infer<typeof categorySchema>
