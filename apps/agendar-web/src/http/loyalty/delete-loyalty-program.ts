import { api } from "@/lib/api-client";

export async function deleteLoyaltyProgram(id: string) {
  await api.delete(`/loyalty-programs/${id}/permanent`);
}
