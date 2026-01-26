import { api } from "@/lib/api-client";

export interface CheckBonusResponse {
  hasBonus: boolean;
  currentPoints: number;
  requiredPoints: number;
  loyaltyProgramId: string | null;
  rewardService?: {
    id: string;
    name: string;
  };
}

export interface CheckBonusParams {
  customerId: string;
  serviceId: string;
}

export async function checkBonus(params: CheckBonusParams) {
  const response = await api.get<CheckBonusResponse>("/check-bonus", {
    params,
  });

  return response.data;
}
