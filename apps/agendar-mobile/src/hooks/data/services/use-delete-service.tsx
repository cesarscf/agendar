import { useMutation } from "@tanstack/react-query"
import { deleteService } from "@/http/service/delete-service"
import { queryClient } from "@/lib/react-query"

export function useDeleteService() {
  return useMutation<boolean, string, string>({
    mutationFn: async id => {
      const { data, error } = await deleteService(id)
      if (error) throw error
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}
