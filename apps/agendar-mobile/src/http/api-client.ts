import axios from "axios"
import * as SecureStore from "expo-secure-store"

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
})

api.interceptors.request.use(
  async config => {
    const token = await SecureStore.getItemAsync("token")
    const establishmentId = await SecureStore.getItemAsync("establishment-id")

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`

      if (establishmentId) {
        config.headers["x-establishment-id"] = establishmentId
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export { api }
