import type { Partner } from "@/http/partner/get-partner";

export interface AuthState {
  isAuthenticated: boolean;
  partner: Partner | null;
  isLoading: boolean;
}

export interface RouterContext {
  auth: AuthState;
}
