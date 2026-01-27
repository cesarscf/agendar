import { api } from "@/lib/api-client"

interface CreateCustomerPortalResponse {
  url: string
}

export async function createCustomerPortal() {
  const response = await api.post<CreateCustomerPortalResponse>(
    "/subscriptions/customer-portal"
  )

  return response.data
}
