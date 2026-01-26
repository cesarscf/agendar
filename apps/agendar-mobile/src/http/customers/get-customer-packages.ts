import { api } from "../api-client"
import { handleApiError } from "@/utils"

export type CustomerPackage = {
  id: string
  remainingSessions: number
  totalSessions: number
  paid: boolean
  name: string | null
  description: string | null
  usedSessions: number
}

export async function getCustomerPackages(customerId: string) {
  try {
    const response = await api.get<CustomerPackage[]>(
      `/me/packages/${customerId}`
    )

    return {
      data: response.data,
      error: null,
    }
  } catch (err) {
    const { error } = handleApiError(err)

    return {
      data: null,
      error,
    }
  }
}
