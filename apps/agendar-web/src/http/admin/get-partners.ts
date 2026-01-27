import { adminApi } from "@/lib/admin-api-client"

export interface Partner {
  id: string
  name: string
  email: string
  state: string | null
  city: string | null
  createdAt: string
  subscription: {
    id: string
    status: string
    currentPeriodEnd: string
    cancelAtPeriodEnd: boolean
    plan: {
      id: string
      name: string
      price: string
    } | null
  } | null
  establishmentsCount: number
}

interface GetPartnersResponse {
  partners: Partner[]
}

export async function getPartners() {
  const response = await adminApi.get<GetPartnersResponse>("/admin/partners")
  return response.data
}
