import { z } from "zod"

export const blockSchema = z.object({
  id: z.string().uuid(),
  startsAt: z.string(),
  endsAt: z.string(),
  reason: z.string(),
})

export const recurringBlockSchema = z.object({
  id: z.string().uuid(),
  weekday: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  reason: z.string(),
})

export const createBlockSchema = z.object({
  startsAt: z.date({
    required_error: "Data de início é obrigatória",
  }),
  endsAt: z.date({
    required_error: "Data de fim é obrigatória",
  }),
  reason: z
    .string({ required_error: "Motivo é obrigatório" })
    .min(3, "Motivo deve ter pelo menos 3 caracteres"),
})

export const createRecurringBlockSchema = z.object({
  weekday: z
    .number({ required_error: "Dia da semana é obrigatório" })
    .min(0)
    .max(6),
  startTime: z
    .string({ required_error: "Hora de início é obrigatória" })
    .min(1, "Hora de início é obrigatória")
    .regex(/^\d{2}:\d{2}$/, "Formato inválido. Use HH:MM"),
  endTime: z
    .string({ required_error: "Hora de fim é obrigatória" })
    .min(1, "Hora de fim é obrigatória")
    .regex(/^\d{2}:\d{2}$/, "Formato inválido. Use HH:MM"),
  reason: z
    .string({ required_error: "Motivo é obrigatório" })
    .min(3, "Motivo deve ter pelo menos 3 caracteres"),
})

export type EmployeeBlock = z.infer<typeof blockSchema>
export type EmployeeRecurringBlock = z.infer<typeof recurringBlockSchema>
export type CreateEmployeeBlockRequest = z.infer<typeof createBlockSchema>
export type CreateEmployeeRecurringBlockRequest = z.infer<
  typeof createRecurringBlockSchema
>
