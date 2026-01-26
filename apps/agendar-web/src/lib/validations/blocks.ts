import z from "zod"

export const blockSchema = z.object({
  id: z.uuid(),
  endsAt: z.date(),
  startsAt: z.date(),
  reason: z.string(),
})

export const recurringBlockSchema = z.object({
  id: z.uuid(),
  weekday: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  reason: z.string(),
})

export const createBlockSchema = blockSchema.omit({ id: true })
export const createRecurringBlockSchema = recurringBlockSchema.omit({
  id: true,
})

export type EmployeeRecurringBlock = z.infer<typeof recurringBlockSchema>
export type EmployeeBlock = z.infer<typeof blockSchema>

export type CreateEmployeeBlockRequest = z.infer<typeof createBlockSchema>
export type CreateEmployeeRecurringBlockRequest = z.infer<
  typeof createRecurringBlockSchema
>
