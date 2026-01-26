import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activateLoyaltyProgram } from "@/http/loyalty/activate-loyalty-program";
import { checkBonus } from "@/http/loyalty/check-bonus";
import { createLoyaltyProgram } from "@/http/loyalty/create-loyalty-program";
import { deleteLoyaltyProgram } from "@/http/loyalty/delete-loyalty-program";
import { desactiveLoyaltyProgram } from "@/http/loyalty/desactive-loyalty-program";
import { getLoyaltyProgram } from "@/http/loyalty/get-loyalty-program";
import { getLoyaltyPrograms } from "@/http/loyalty/get-loyalty-programs";
import { updateLoyaltyProgram } from "@/http/loyalty/update-loyalty-program";
import { queryKeys } from "@/lib/query-keys";
import type {
  CreateLoyaltyProgram,
  UpdateLoyaltyProgram,
} from "@/lib/validations/loyalty-program";

// ========== QUERIES ==========

export function useLoyaltyPrograms() {
  return useQuery({
    queryKey: queryKeys.loyaltyPrograms,
    queryFn: getLoyaltyPrograms,
  });
}

export function useLoyaltyProgram(programId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.loyaltyProgram(programId),
    queryFn: () => getLoyaltyProgram(programId),
    enabled: enabled && !!programId,
  });
}

export function useCheckBonus(
  customerId: string,
  serviceId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.checkBonus(customerId, serviceId),
    queryFn: () => checkBonus({ customerId, serviceId }),
    enabled: enabled && !!customerId && !!serviceId,
  });
}

// ========== MUTATIONS ==========

export function useCreateLoyaltyProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLoyaltyProgram) => createLoyaltyProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPrograms });
    },
  });
}

export function useUpdateLoyaltyProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLoyaltyProgram) => updateLoyaltyProgram(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.loyaltyProgram(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPrograms });
    },
  });
}

export function useActivateLoyaltyProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId: string) => activateLoyaltyProgram(programId),
    onSuccess: (_data, programId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.loyaltyProgram(programId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPrograms });
    },
  });
}

export function useDesactiveLoyaltyProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId: string) => desactiveLoyaltyProgram(programId),
    onSuccess: (_data, programId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.loyaltyProgram(programId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPrograms });
    },
  });
}

export function useDeleteLoyaltyProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId: string) => deleteLoyaltyProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loyaltyPrograms });
    },
  });
}
