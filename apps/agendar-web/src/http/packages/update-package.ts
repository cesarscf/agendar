import { api } from "@/lib/api-client"
import { convertUnmaskedToCents } from "@/lib/utils"

import type { UpdatePackageRequest } from "@/lib/validations/package"
import { updatePackageItems } from "./update-package-items"

export async function updatePackage(inputs: UpdatePackageRequest) {
  const payload = {
    ...inputs,
    price: inputs.price ? convertUnmaskedToCents(inputs.price) : undefined,
  }

  if (inputs.quantity && inputs.serviceId) {
    await updatePackageItems({
      items: [{ quantity: inputs.quantity, serviceId: inputs.serviceId }],
      packageId: inputs.id,
    })
  }

  await api.put(`/packages/${inputs.id}`, payload)
}
