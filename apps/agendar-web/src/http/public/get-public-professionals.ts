import { api } from "@/lib/api-client"

export type PublicProfessional = {
  id: string
  name: string
  avatarUrl: string
  biography: string
}

export async function getPublicProfessionals(slug: string) {
  const response = await api.get<PublicProfessional[]>(
    `/public/${slug}/professionals`
  )

  return response.data
}
