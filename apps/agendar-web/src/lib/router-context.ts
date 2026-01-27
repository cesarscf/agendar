import type { Admin } from "@/hooks/use-admin-auth"
import type { Partner } from "@/http/partner/get-partner"

export interface AuthState {
  isAuthenticated: boolean
  partner: Partner | null
  isLoading: boolean
}

export interface AdminAuthState {
  isAuthenticated: boolean
  admin: Admin | null
  isLoading: boolean
}

export interface RouterContext {
  auth: AuthState
  adminAuth: AdminAuthState
}
