import { createPackage } from "@/http/packages/create-package"
import { queryClient } from "@/lib/react-query"
import type { CreatePackageRequest, Package } from "@/lib/validations/packages"
import { useMutation } from "@tanstack/react-query"

export function useCreatePackage() {
  return useMutation<Package, string, CreatePackageRequest>({
    mutationFn: async inputs => {
      const { data, error } = await createPackage(inputs)

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packages"],
      })
    },
  })
}
