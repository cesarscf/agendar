import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "@/http/customers/create-customer";
import { deleteCustomer } from "@/http/customers/delete-customer";
import { getCustomer } from "@/http/customers/get-customer";
import { getCustomerLoyaltyPrograms } from "@/http/customers/get-customer-loyalty-programs";
import { getCustomerPackages } from "@/http/customers/get-customer-packages";
import { getCustomers } from "@/http/customers/get-customers";
import { getCustomersHasActivePackage } from "@/http/customers/get-customers-has-active-package";
import { updateCustomer } from "@/http/customers/update-customer";
import { queryKeys } from "@/lib/query-keys";
import type {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "@/lib/validations/customer";

// ========== QUERIES ==========

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: getCustomers,
  });
}

export function useCustomer(customerId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.customer(customerId),
    queryFn: () => getCustomer(customerId),
    enabled: enabled && !!customerId,
  });
}

export function useCustomerPackages(customerId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.customerPackages(customerId),
    queryFn: () => getCustomerPackages(customerId),
    enabled: enabled && !!customerId,
  });
}

export function useCustomerLoyaltyPrograms(
  params: { customerPhone: string; establishmentId: string },
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.customerLoyaltyPrograms(params.customerPhone),
    queryFn: () => getCustomerLoyaltyPrograms(params),
    enabled: enabled && !!params.customerPhone && !!params.establishmentId,
  });
}

export function useCustomersWithActivePackage(
  params: { customerPhone: string; serviceId: string; establishmentId: string },
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.customersWithActivePackage,
    queryFn: () => getCustomersHasActivePackage(params),
    enabled:
      enabled &&
      !!params.customerPhone &&
      !!params.serviceId &&
      !!params.establishmentId,
  });
}

// ========== MUTATIONS ==========

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCustomerRequest) => updateCustomer(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
    },
  });
}
