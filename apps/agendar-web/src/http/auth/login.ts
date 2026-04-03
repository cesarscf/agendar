import { api } from "@/lib/api-client"
import { type UserRole, setRole, setToken } from "@/lib/auth"

export interface SignInRequest {
  email: string
  password: string
  rememberMe: boolean
}

export type AuthResponse = {
  token: string
  role: UserRole
}

export async function login({
  email,
  password,
  rememberMe,
}: SignInRequest) {
  const response = await api.post<AuthResponse>("/login", {
    email,
    password,
  })

  setToken(response.data.token, rememberMe)
  setRole(response.data.role, rememberMe)

  return response.data
}
