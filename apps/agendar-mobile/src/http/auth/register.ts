import { AxiosError } from "axios"
import { api } from "../api-client"

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface RegisterResponse {
  token: string
}

export async function register({ name, email, password }: RegisterRequest) {
  try {
    const response = await api.post<RegisterResponse>("/register", {
      name,
      email,
      password,
    })

    return {
      data: response.data,
      error: null,
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      const message = err.response?.data.message

      return {
        data: null,
        error: message,
      }
    }

    return {
      data: null,
      error: "Erro inesperado, tente novamente em alguns minutos.",
    }
  }
}
