import { api } from "@/lib/api-client";

export type CustomerPackage = {
  id: string;
  remainingSessions: number;
  totalSessions: number;
  paid: boolean;
  name: string | null;
  description: string | null;
  // image: string | null;
  usedSessions: number;
};

export async function getCustomerPackages(id: string) {
  const response = await api.get<CustomerPackage[]>(`/me/packages/${id}`);

  return response.data;
}
