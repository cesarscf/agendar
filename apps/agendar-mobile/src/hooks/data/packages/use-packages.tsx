import { useQuery } from "@tanstack/react-query"

import type { Package } from "@/lib/validations/packages"
import { getPackages } from "@/http/packages/get-packages"

export function usePackages() {
  return useQuery<Package[], string>({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await getPackages()

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}
