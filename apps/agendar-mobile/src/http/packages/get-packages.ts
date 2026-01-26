import { api } from "../api-client"
import type { Package } from "@/lib/validations/packages"
import { handleApiError } from "@/utils"

export async function getPackages() {
  try {
    const result = await api.get<Package[]>("/packages")

    return {
      data: result.data,
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
