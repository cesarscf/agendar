import { useMutation } from "@tanstack/react-query"
import {
  type UpdateSubscriptionResponse,
  updateSubscription,
} from "@/http/subscription/update-subscription"
import { queryClient } from "@/lib/react-query"

export function useUpdateSubscription() {
  return useMutation<UpdateSubscriptionResponse, string, string>({
    mutationFn: async planId => {
      const { data, error } = await updateSubscription(planId)

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
