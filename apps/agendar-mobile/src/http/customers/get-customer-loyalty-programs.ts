import { api } from "../api-client"
import { handleApiError } from "@/utils"

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

export async function getCustomerLoyaltyPrograms(customerPhone: string) {
  try {
    const response = await api.get<GetCustomerLoyaltyProgramResponse>(
      "/my-loyalty-programs",
      {
        headers: {
          "x-customer-phone": customerPhone,
        },
      }
    )

    return {
      data: response.data.loyaltyPrograms,
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
