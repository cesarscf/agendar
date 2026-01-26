import { useQuery } from "@tanstack/react-query"
import {
  type GetSubscriptionResponse,
  getSubscription,
} from "@/http/subscription/get-subscription"

export function useSubscription(subscriptionId: string) {
  return useQuery<GetSubscriptionResponse, string>({
    queryKey: [subscriptionId],
    enabled: !!subscriptionId,
    queryFn: async () => {
      const { data, error } = await getSubscription(subscriptionId)

      if (error) {
        throw error
      }

      return data!
    },
  })
}
