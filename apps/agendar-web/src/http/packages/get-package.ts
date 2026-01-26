import { api } from "@/lib/api-client"

import type { PackageWithItems } from "@/lib/validations/package"

export async function getPackage(packageId: string) {
  const response = await api.get<PackageWithItems>(`/packages/${packageId}`)

  return response.data
}
