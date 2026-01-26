import z from "zod"

export const availabilitySchema = z.object({
  id: z.string(),
  weekday: z.number(),
  opensAt: z.string(),
  closesAt: z.string(),
  breakStart: z.string().optional(),
  breakEnd: z.string().optional(),
})

export const updateAvailabilitySchema = z.object({
  availability: z.array(availabilitySchema.omit({ id: true })),
})

export type Availability = z.infer<typeof availabilitySchema>
export type UpdateAvailabilityRequest = z.infer<typeof updateAvailabilitySchema>
