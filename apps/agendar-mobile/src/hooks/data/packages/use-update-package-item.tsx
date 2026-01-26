import { updatePackageItem } from "@/http/packages/update-package-item"
import { queryClient } from "@/lib/react-query"
import type { UpdatePackageItemRequest } from "@/lib/validations/packages"
import { useMutation } from "@tanstack/react-query"

export function useUpdatePackageItem() {
  return useMutation<
    boolean,
    string,
    UpdatePackageItemRequest & {
      packageId: string
    }
  >({
    mutationFn: async inputs => {
      const { data, error } = await updatePackageItem(inputs)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess(_, variables) {
      const packageId = variables.packageId

      queryClient.invalidateQueries({
        queryKey: ["packages"],
      })

      queryClient.invalidateQueries({
        queryKey: [packageId],
      })
    },
  })
}
