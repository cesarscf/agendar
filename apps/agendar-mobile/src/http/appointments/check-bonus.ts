import type { BonusData } from "@/lib/validations/checkin"
import { handleApiError } from "@/utils"
import { api } from "../api-client"

export interface CheckBonusParams {
  customerId: string
  serviceId: string
}

export async function checkBonus(params: CheckBonusParams) {
  try {
    const response = await api.get<BonusData>("/check-bonus", {
      params: {
        customerId: params.customerId,
        serviceId: params.serviceId,
      },
    })

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
