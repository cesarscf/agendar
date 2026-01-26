import { useMutation } from "@tanstack/react-query"
import { deletePackage } from "@/http/packages/delete-package"
import { queryClient } from "@/lib/react-query"

export function useDeletePackage() {
  return useMutation<boolean, string, string>({
    mutationFn: async id => {
      const { data, error } = await deletePackage(id)
      if (error) throw error
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] })
    },
  })
}
