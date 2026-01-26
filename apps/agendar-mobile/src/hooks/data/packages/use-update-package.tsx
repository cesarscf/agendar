import { updatePackage } from "@/http/packages/update-package"
import { queryClient } from "@/lib/react-query"
import type { UpdatePackageRequest } from "@/lib/validations/packages"
import { useMutation } from "@tanstack/react-query"

export function useUpdatePackage() {
  return useMutation<boolean, string, UpdatePackageRequest>({
    mutationFn: async inputs => {
      const { data, error } = await updatePackage(inputs)
      if (error) {
        throw error
      }

      return data!
    },
    onSuccess(_, variables) {
      const packageId = variables.id

      queryClient.invalidateQueries({
        queryKey: ["packages"],
      })

      queryClient.invalidateQueries({
        queryKey: [packageId],
      })
    },
  })
}
