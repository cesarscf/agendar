import axios from "axios"
import { env } from "@/env"
import { getToken } from "./auth"

export const api = axios.create({
  baseURL: env.VITE_API_URL,
})

api.interceptors.request.use(config => {
  const token = getToken()

  if (token) {
    // @ts-expect-error
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  return config
})
