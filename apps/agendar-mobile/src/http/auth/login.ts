import { handleApiError } from "@/utils"
import { api } from "../api-client"

export type UserRole = "partner" | "employee"

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  role: UserRole
}

export async function login({
  email,
  password,
}: LoginRequest) {
  try {
    const response = await api.post<LoginResponse>(
      "/login",
      {
        email,
        password,
      }
    )

    return {
      data: response.data,
      error: null,
    }
  } catch (err) {
    const { error } = handleApiError(err)

    return {
      data: null,
      error,
    }
  }
}
