import { api } from "@/lib/api-client"

interface GetSetupIntent {
  clientSecret: "string"
}

export async function getSetupIntent() {
  const result = await api.get<GetSetupIntent>("/payment-methods/setup-intent")

  return result.data
}
