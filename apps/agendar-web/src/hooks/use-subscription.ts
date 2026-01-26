import { useQuery } from "@tanstack/react-query";
import type { Subscription } from "@/http/payments/get-subscriptions";
import { getSubscriptions } from "@/http/payments/get-subscriptions";
import { useAuth } from "./use-auth";

export interface UseSubscriptionReturn {
  subscriptions: Subscription[];
  currentSubscription: Subscription | null;
  isLoading: boolean;
  // Computed values
  isTrial: boolean;
  isExpired: boolean;
  hasActiveSubscription: boolean;
}

/**
 * Hook para gerenciar subscriptions
 * Só carrega se o usuário estiver autenticado
 */
export function useSubscription(): UseSubscriptionReturn {
  const { isAuthenticated } = useAuth();

  const {
    data: subscriptions = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const currentSubscription = subscriptions[0] ?? null;

  // Subscription computed values
  const isTrial = currentSubscription?.status === "trialing";
  const isExpired = currentSubscription?.status === "expired";
  const canAccess = ["active", "trialing"].includes(
    currentSubscription?.status ?? "",
  );
  const hasActiveSubscription = !!currentSubscription && canAccess;

  return {
    subscriptions,
    currentSubscription,
    isLoading: isLoading || isFetching,
    isTrial,
    isExpired,
    hasActiveSubscription,
  };
}
