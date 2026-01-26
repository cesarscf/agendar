import { api } from "@/lib/api-client"

export async function cancelAppointmentPublic({
  slug,
  id,
  phoneNumber,
}: {
  slug: string
  id: string
  phoneNumber: string
}) {
  await api.patch(`/public/${slug}/appointments/${id}/cancel`, { phoneNumber })
}
