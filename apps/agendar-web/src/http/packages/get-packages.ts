import { api } from "@/lib/api-client"

import type { Package } from "@/lib/validations/package"

export async function getPackages() {
  const response = await api.get<Package[]>("/packages")

  return response.data
}
