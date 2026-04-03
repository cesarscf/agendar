import type { Admin } from "@/hooks/use-admin-auth"
import type {
  EmployeeEstablishment,
  EmployeeProfile,
} from "@/http/employee-self/get-employee-profile"
import type { Partner } from "@/http/partner/get-partner"
import type { UserRole } from "@/lib/auth"

export interface AuthState {
  isAuthenticated: boolean
  partner: Partner | null
  employee: EmployeeProfile | null
  employeeEstablishment: EmployeeEstablishment | null
  role: UserRole | null
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
