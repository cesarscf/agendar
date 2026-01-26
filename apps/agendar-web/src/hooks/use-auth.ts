import { useQuery } from "@tanstack/react-query"
import type { Partner } from "@/http/partner/get-partner"
import { getPartner } from "@/http/partner/get-partner"
import { getToken } from "@/lib/auth"

export interface UseAuthReturn {
  isAuthenticated: boolean
  partner: Partner | null
  isLoading: boolean
}

/**
 * Hook simplificado para autenticação
 * Apenas verifica se o usuário tem token válido e carrega dados do partner
 */
export function useAuth(): UseAuthReturn {
  const hasToken = !!getToken()

  const {
    data: partnerData,
    isLoading: partnerLoading,
    isFetching: partnerFetching,
    status: partnerStatus,
  } = useQuery({
    queryKey: ["partner"],
    queryFn: getPartner,
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  const partner = partnerData?.partner ?? null

  // Se tem token mas a query ainda não foi executada ou está carregando
  const isLoading =
    hasToken &&
    (partnerLoading || partnerFetching || partnerStatus === "pending")

  return {
    isAuthenticated: hasToken && !!partner,
    partner,
    isLoading,
  }
}
