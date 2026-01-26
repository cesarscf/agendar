import { useQuery } from "@tanstack/react-query";
import { getEstablishment } from "@/http/establishment/get-establishment";
import type { Establishment } from "@/lib/validations/establishment";
import { useAuth } from "./use-auth";

export interface UseEstablishmentReturn {
  establishment: Establishment | null;
  isLoading: boolean;
}

/**
 * Hook para gerenciar dados do establishment
 * Só carrega se o usuário estiver autenticado
 */
export function useEstablishment(): UseEstablishmentReturn {
  const { isAuthenticated } = useAuth();

  const {
    data: establishment = null,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["establishment"],
    queryFn: getEstablishment,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    establishment,
    isLoading: isLoading || isFetching,
  };
}
