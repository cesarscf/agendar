import { useQuery } from "@tanstack/react-query"
import { getServices } from "@/http/service/get-services"
import type { Service } from "@/lib/validations/service"

export function useServices() {
  return useQuery<Service[], string>({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await getServices()

      if (error) {
        throw error
      }

      return data ?? []
    },
  })
}
