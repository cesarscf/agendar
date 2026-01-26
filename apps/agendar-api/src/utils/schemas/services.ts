import z from "zod"

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.string({ message: "Price must be a number 1000 = 10.00" }),
  active: z.boolean(),
  durationInMinutes: z.number(),
  description: z.string().nullish(),
  image: z.string().nullish(),
  categories: z.array(categorySchema).optional(),
})

export const createServiceSchema = z.object({
  name: z.string(),
  price: z.string({ message: "Price must be a number 1000 = 10.00" }),
  active: z.boolean(),
  durationInMinutes: z.number(),
  description: z.string().nullish(),
  image: z.string().nullish(),
  categoryIds: z.array(z.string().uuid()).optional(),
})

export const updateServiceSchema = z.object({
  name: z.string().optional(),
  price: z.string().optional(),
  active: z.boolean().optional(),
  durationInMinutes: z.number().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
})
