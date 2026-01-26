import { api } from "@/lib/api-client"

export type CustomerLoyaltyProgram = {
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
}

export type GetCustomerLoyaltyProgramResponse = {
  loyaltyPrograms: CustomerLoyaltyProgram[]
}

export interface GetCustomerLoyaltyProgramParams {
  customerPhone: string
  establishmentId: string
}

export async function getCustomerLoyaltyPrograms({
  customerPhone,
  establishmentId,
}: GetCustomerLoyaltyProgramParams) {
  const response = await api.get<GetCustomerLoyaltyProgramResponse>(
    "/my-loyalty-programs",
    {
      headers: {
        "x-customer-phone": customerPhone,
        "x-establishment-id": establishmentId,
      },
    }
  )

  return response.data
}
