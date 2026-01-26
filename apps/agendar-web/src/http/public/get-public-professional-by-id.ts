import { api } from "@/lib/api-client"
import type { PublicProfessional } from "./get-public-professionals"

export async function getPublicProfessionalById({
  slug,
  professionalId,
}: {
  slug: string
  professionalId: string
}) {
  const response = await api.get<PublicProfessional>(
    `/public/${slug}/professionals/${professionalId}`
  )

  return response.data
}
