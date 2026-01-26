import { api } from "@/lib/api-client"

export interface LinkCustomerToPackage {
  customerId: string
  packageId: string
}

export async function linkCustomerToPackage(inputs: LinkCustomerToPackage) {
  const response = await api.post<{
    id: string
    customerId: string
    servicePackageId: string
    totalSessions: string
    remainingSessions: string
    paid: boolean
    purchasedAt: Date
    expiresAt: Date
  }>("/public/customers/packages", inputs)

  return response.data
}
