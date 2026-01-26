import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPackage } from "@/http/packages/create-package";
import { deletePackage } from "@/http/packages/delete-package";
import { getPackage } from "@/http/packages/get-package";
import { getPackages } from "@/http/packages/get-packages";
import { updatePackage } from "@/http/packages/update-package";
import { updatePackageItems } from "@/http/packages/update-package-items";
import { queryKeys } from "@/lib/query-keys";
import type {
  CreatePackageRequest,
  UpdatePackageItemsRequest,
  UpdatePackageRequest,
} from "@/lib/validations/package";

// ========== QUERIES ==========

export function usePackages() {
  return useQuery({
    queryKey: queryKeys.packages,
    queryFn: getPackages,
  });
}

export function usePackage(packageId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.package(packageId),
    queryFn: () => getPackage(packageId),
    enabled: enabled && !!packageId,
  });
}

// ========== MUTATIONS ==========

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePackageRequest) => createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packages });
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePackageRequest) => updatePackage(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.package(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.packages });
    },
  });
}

export function useUpdatePackageItems(packageId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePackageItemsRequest) =>
      updatePackageItems({ ...data, packageId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.package(packageId) });
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageId: string) => deletePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packages });
    },
  });
}
