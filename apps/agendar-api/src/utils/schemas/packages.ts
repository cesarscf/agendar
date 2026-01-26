import z from "zod"

export const packageSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  commission: z.string({ message: "Price must be a number 1000 = 10.00" }),
  price: z.string({ message: "Price must be a number 1000 = 10.00" }),
  description: z.string().nullish(),
  image: z.string().nullish(),
})

export const packageSchemaWithItems = packageSchema.extend({
  items: z
    .array(
      z.object({
        serviceId: z.string(),
        quantity: z.number(),
        name: z.string(),
      })
    )
    .optional(),
})
