import { api } from "../api-client"
import type { UpdatePackageRequest } from "@/lib/validations/packages"
import { handleApiError } from "@/utils"
import { parseBRLToCents } from "@/utils/currency"

export async function updatePackage(inputs: UpdatePackageRequest) {
  try {
    const payload: Record<string, unknown> = { ...inputs }

    if (inputs.price) {
      payload.price = parseBRLToCents(inputs.price)
    }

    if (inputs.commission) {
      payload.commission = inputs.commission
    }

    await api.put(`/packages/${inputs.id}`, payload)

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
