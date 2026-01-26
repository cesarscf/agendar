import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createService } from "@/http/services/create-service"
import { deleteService } from "@/http/services/delete-service"
import { getService } from "@/http/services/get-service"
import { getServices } from "@/http/services/get-services"
import { updateService } from "@/http/services/update-service"
import { queryKeys } from "@/lib/query-keys"
import type {
  CreateServiceRequest,
  UpdateServiceRequest,
} from "@/lib/validations/service"

// ========== QUERIES ==========

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: getServices,
  })
}

export function useService(serviceId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.service(serviceId),
    queryFn: () => getService(serviceId),
    enabled: enabled && !!serviceId,
  })
}

// ========== MUTATIONS ==========

export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateServiceRequest) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateServiceRequest) => updateService(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.service(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.services })
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serviceId: string) => deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services })
    },
  })
}
