import { z } from "zod"

export const paymentMethodSchema = z.object({
  id: z.string().uuid(),
  brand: z.string(),
  last4: z.string(),
  expMonth: z.number(),
  expYear: z.number(),
  isDefault: z.boolean(),
})

export type PaymentMethod = z.infer<typeof paymentMethodSchema>
