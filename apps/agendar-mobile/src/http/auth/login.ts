import { api } from "../api-client"
import { handleApiError } from "@/utils"

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

export async function login({ email, password }: LoginRequest) {
  try {
    const response = await api.post<LoginResponse>("/login", {
      email: email,
      password: password,
    })

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
