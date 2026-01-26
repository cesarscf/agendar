import { api } from "@/lib/api-client"

export interface Subscription {
  id: string
  status: string
  currentPeriodEnd: string
  endedAt: Date
  integrationSubscriptionId: string
  plan: {
    id: string
    name: string
    description: string
    price: string
  }
}

export async function getSubscriptions() {
  const response = await api.get<Subscription[]>("/subscriptions")

  return response.data
}
