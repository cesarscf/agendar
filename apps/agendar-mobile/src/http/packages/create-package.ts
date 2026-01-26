import type { CreatePackageRequest, Package } from "@/lib/validations/packages"
import { handleApiError } from "@/utils"
import { parseBRLToCents } from "@/utils/currency"
import { api } from "../api-client"

export async function createPackage(inputs: CreatePackageRequest) {
  try {
    const result = await api.post<Package>("/packages", {
      ...inputs,
      price: parseBRLToCents(inputs.price),
      commission: inputs.commission,
    })

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
