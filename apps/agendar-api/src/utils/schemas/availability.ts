import z from "zod"

export const availabilitySchema = z.object({
  id: z.string().uuid(),
  weekday: z.number(),
  opensAt: z.string(),
  closesAt: z.string(),
  breakStart: z.string().nullable(),
  breakEnd: z.string().nullable(),
})
