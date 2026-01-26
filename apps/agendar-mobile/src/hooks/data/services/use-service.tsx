import { useQuery } from "@tanstack/react-query"
import { getService } from "@/http/service/get-service"
import type { Service } from "@/lib/validations/service"

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
