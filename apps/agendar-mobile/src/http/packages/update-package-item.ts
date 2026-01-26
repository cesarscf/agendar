import type { UpdatePackageItemRequest } from "@/lib/validations/packages"
import { handleApiError } from "@/utils"
import { api } from "../api-client"

export async function updatePackageItem(
  inputs: UpdatePackageItemRequest & { packageId: string }
) {
  try {
    await api.post(`/packages/${inputs.packageId}/items`, {
      ...inputs,
    })

    return {
      data: true,
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
