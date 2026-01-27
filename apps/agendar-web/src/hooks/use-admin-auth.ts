import { decodeAdminToken, getAdminToken } from "@/lib/admin-auth"

export interface Admin {
  id: string
  role: string
}

export interface UseAdminAuthReturn {
  isAuthenticated: boolean
  admin: Admin | null
  isLoading: boolean
}

/**
 * Hook para autenticacao de admin
 * Decodifica o JWT para obter dados do admin
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const hasToken = !!getAdminToken()
  const decoded = decodeAdminToken()

  const admin = decoded
    ? {
        id: decoded.sub,
        role: decoded.role,
      }
    : null

  return {
    isAuthenticated: hasToken && !!admin,
    admin,
    isLoading: false, // JWT decoding is synchronous
  }
}
