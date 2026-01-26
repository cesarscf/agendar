import { cancelSubscription } from "@/http/subscription/cancel-subscription"

import { queryClient } from "@/lib/react-query"
import { useMutation } from "@tanstack/react-query"

export function useCancelSubscription() {
  return useMutation<boolean, string>({
    mutationFn: async () => {
      const { data, error } = await cancelSubscription()

      if (error) {
        throw error
      }

      return data!
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["subscription"],
      })
    },
  })
}
