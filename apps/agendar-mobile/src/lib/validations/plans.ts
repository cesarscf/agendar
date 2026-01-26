import { z } from "zod"

export const plansSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  intervalMonth: z.number(),
  trialPeriodDays: z.number(),
  minimumProfessionalsIncluded: z.number(),
  maximumProfessionalsIncluded: z.number(),
  status: z.string(),
})

export type Plan = z.infer<typeof plansSchema>
