import { useQuery } from "@tanstack/react-query"
import { getPackage } from "@/http/packages/get-package"
import type { PackageWithItems } from "@/lib/validations/packages"

export function usePackage(packageId: string) {
  return useQuery<PackageWithItems, string>({
    queryKey: ["packages", packageId],
    enabled: !!packageId,
    queryFn: async () => {
      const { data, error } = await getPackage(packageId)

      if (error) {
        throw error
      }

      return data!
    },
  })
}
