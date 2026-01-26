import { z } from "zod"

export const paymentTypeSchema = z.enum([
  "pix",
  "credit_card",
  "debit_card",
  "cash",
  "other",
  "package",
  "loyalty",
])

export type PaymentType = z.infer<typeof paymentTypeSchema>

export const checkinSchema = z.object({
  status: z.enum(["completed"]),
  paymentType: paymentTypeSchema,
  paymentAmount: z.string(),
  notes: z.string().optional(),
})

export type CheckinFormData = z.infer<typeof checkinSchema>

export interface CheckinRequest extends CheckinFormData {
  appointmentId: string
}

export interface BonusData {
  hasBonus: boolean
  currentPoints: number
}
