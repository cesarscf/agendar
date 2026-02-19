import { api } from "@/lib/api-client"

export async function resetPassword(token: string, password: string) {
  await api.post("/reset-password", { token, password })
}
