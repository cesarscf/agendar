import { api } from "@/lib/api-client"

export type PublicProfessional = {
  id: string
  name: string
  avatarUrl?: string
  biography: string
}

export async function getPublicServiceProfessionals({
  slug,
  serviceId,
}: {
  slug: string
  serviceId: string
}) {
  const response = await api.get<PublicProfessional[]>(
    `/public/${slug}/services/${serviceId}/professionals`
  )

  return response.data
}
