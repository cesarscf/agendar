import axios from "axios"
import { env } from "@/env"
import { getAdminToken } from "./admin-auth"

export const adminApi = axios.create({
  baseURL: env.VITE_API_URL,
})

adminApi.interceptors.request.use(config => {
  const token = getAdminToken()

  if (token) {
    // @ts-expect-error
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  return config
})
