import { api } from "@/lib/api-client"
import { convertUnmaskedToCents } from "@/lib/utils"
import type { CreatePackageRequest } from "@/lib/validations/package"
import { updatePackageItems } from "./update-package-items"

export async function createPackage(inputs: CreatePackageRequest) {
  const payload = {
    ...inputs,
    price: convertUnmaskedToCents(inputs.price),
  }

  const result = await api.post<{ id: string }>("/packages", payload)

  if (inputs.quantity && inputs.serviceId) {
    await updatePackageItems({
      items: [{ quantity: inputs.quantity, serviceId: inputs.serviceId }],
      packageId: result.data.id,
    })
  }

  return result.data
}
