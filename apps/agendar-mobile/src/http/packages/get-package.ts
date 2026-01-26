import { api } from "../api-client"
import type { PackageWithItems } from "@/lib/validations/packages"
import { handleApiError } from "@/utils"

export async function getPackage(packageId: string) {
  try {
    const { data } = await api.get<PackageWithItems>(`/packages/${packageId}`)
    return {
      data: data,
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
