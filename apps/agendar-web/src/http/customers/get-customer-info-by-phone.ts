import { api } from "@/lib/api-client"

export type GetCustomerInfoByPhoneResponse = {
  customer: {
    name: string
    phoneNumber: string
    birthDate: Date
  }
  packages: {
    packageName: string
    packageDescription: string | null
    purchasedAt: Date
    remainingSessions: number
    totalSessions: number
    paid: boolean
  }[]
  loyaltyPrograms: {
    id: string
    name: string
    points: number
    requiredPoints: number
    active: boolean
    rewardService: {
      id: string
      name: string
    }
    progress: number
    canRedeem: boolean
  }[]
  appointments: {
    id: string
    serviceName: string
    employeeName: string
    date: string
    startTime: Date
    endTime: Date
    status: "scheduled" | "completed" | "canceled"
    checkin: boolean
    paid: boolean
  }[]
}

export async function GetCustomerInfoByPhone({
  slug,
  phone,
}: {
  slug: string
  phone: string
}) {
  const response = await api.get<GetCustomerInfoByPhoneResponse>(
    `/public/customers/${slug}/phone/${phone}`
  )

  return response.data
}
