import { api } from "@/lib/api-client";

export async function activateLoyaltyProgram(id: string) {
  await api.delete(`/loyalty-programs/${id}`);
}
