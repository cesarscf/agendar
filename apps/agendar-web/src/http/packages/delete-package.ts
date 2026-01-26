import { api } from "@/lib/api-client";

export async function deletePackage(packageId: string) {
  await api.delete(`/packages/${packageId}`);
}
