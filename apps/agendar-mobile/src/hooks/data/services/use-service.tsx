import { useQuery } from "@tanstack/react-query"

import type { Service } from "@/lib/validations/service"
import { getService } from "@/http/service/get-service"

export function useService(serviceId: string) {
  return useQuery<Service, string>({
    queryKey: ["services", serviceId],
    enabled: !!serviceId,
    queryFn: async () => {
      const { data, error } = await getService(serviceId)

      if (error) {
        throw error
      }

      return data!
    },
  })
}
