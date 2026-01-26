import { api } from "@/lib/api-client"

export type PublicLoyaltyProgram = {
  name: string
  serviceRewardName: string
  requiredPoints: number
  rules: {
    serviceName: string
    points: number
  }[]
}

export async function getPublicLoyalties(slug: string) {
  const response = await api.get<PublicLoyaltyProgram[]>(
    `/public/${slug}/loyalty-programs`
  )

  return response.data
}
