import { adminApi } from "@/lib/admin-api-client"
import { setAdminToken } from "@/lib/admin-auth"

export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminLoginResponse {
  token: string
}

export async function adminLogin({ email, password }: AdminLoginRequest) {
  const response = await adminApi.post<AdminLoginResponse>("/admin/login", {
    email,
    password,
  })

  setAdminToken(response.data.token)

  return response.data
}
