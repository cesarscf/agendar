import { useMutation } from "@tanstack/react-query"
import { deleteEmployee } from "@/http/employee/delete-employee"
import { queryClient } from "@/lib/react-query"

export function useDeleteEmployee() {
  return useMutation<boolean, string, string>({
    mutationFn: async id => {
      const { data, error } = await deleteEmployee(id)
      if (error) throw error
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    },
  })
}
