import { api } from "@/lib/api-client"

import type { UpdatePackageItemsRequest } from "@/lib/validations/package"

export async function updatePackageItems(
  inputs: UpdatePackageItemsRequest & { packageId: string }
) {
  const payload = {
    ...inputs,
  }

  await api.post(`/packages/${inputs.packageId}/items`, payload)
}
