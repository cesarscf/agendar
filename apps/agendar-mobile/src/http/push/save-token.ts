import { handleApiError } from "@/utils"
import { api } from "../api-client"

export async function saveToken({
  token,
  userId,
}: {
  token: string
  userId: string
}) {
  try {
    await api.put("/fcm/register", {
      token,
      userId,
    })

    return {
      data: true,
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
