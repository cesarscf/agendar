import { api } from "@/lib/api-client"

export type AppointmentStatus = "scheduled" | "completed" | "canceled"

export type PaymentType =
  | "pix"
  | "credit_card"
  | "debit_card"
  | "cash"
  | "package"
  | "loyalty"
  | "other"

export async function checkin({
  appointmentId,
  status,
  notes,
  paymentType,
  paymentAmount,
}: {
  appointmentId: string
  status: AppointmentStatus
  paymentType: PaymentType
  notes?: string
  paymentAmount: string
}) {
  await api.patch(`/partner/appointments/${appointmentId}/status`, {
    status,
    paymentType,
    notes,
    paymentAmount,
  })
}
