import { api } from "@/lib/api-client"

export type CustomersHasActivePackage = {
  id: string
  purchasedAt: string
  expiresAt: string
  remainingSessions: number
  totalSessions: number
  usedSessions: number
  usagePercentage: number
  paid: boolean
}

export interface GetCustomersHasActivePackageResponse {
  customerPhone: string
  serviceId: string
  establishmentId: string
}

export async function getCustomersHasActivePackage({
  customerPhone,
  serviceId,
  establishmentId,
}: GetCustomersHasActivePackageResponse) {
  const response = await api.get<CustomersHasActivePackage>(
    "/customers/has-active-package",
    {
      params: {
        serviceId,
      },
      headers: {
        "x-customer-phone": customerPhone,
        "x-establishment-id": establishmentId,
      },
    }
  )

  console.log("tem package", response.data)

  return response.data
}
