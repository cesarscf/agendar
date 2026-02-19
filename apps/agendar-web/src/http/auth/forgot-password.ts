import { api } from "@/lib/api-client"

export async function forgotPassword(email: string) {
  await api.post("/forgot-password", { email })
}
