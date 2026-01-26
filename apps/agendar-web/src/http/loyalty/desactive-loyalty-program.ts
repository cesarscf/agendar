import { api } from "@/lib/api-client";

export async function desactiveLoyaltyProgram(id: string) {
  await api.delete(`/loyalty-programs/${id}`);
}
