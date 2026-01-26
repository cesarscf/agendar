import { api } from "../api-client"
import { handleApiError } from "@/utils"

interface GetSetupIntent {
  clientSecret: "string"
}

export async function getSetupIntent() {
  try {
    const result = await api.get<GetSetupIntent>(
      "/payment-methods/setup-intent"
    )

    return {
      data: result.data,
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
