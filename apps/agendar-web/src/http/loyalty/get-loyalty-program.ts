import { api } from "@/lib/api-client";
import type { LoyaltyProgram } from "@/lib/validations/loyalty-program";

export async function getLoyaltyProgram(id: string) {
  const response = await api.get<LoyaltyProgram>(`/loyalty-programs/${id}`);

  return response.data;
}
