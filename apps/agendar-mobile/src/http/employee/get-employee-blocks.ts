import { api } from "../api-client"
import type { EmployeeBlock } from "@/lib/validations/blocks"
import { handleApiError, convertUTCStringToLocalDate } from "@/utils"

interface EmployeeBlockResponse {
  id: string
  startsAt: string
  endsAt: string
  reason: string
}

export async function getEmployeeBlocks(employeeId: string) {
  try {
    const response = await api.get<EmployeeBlockResponse[]>(
      `/employees/${employeeId}/blocks`
    )

    const blocks: EmployeeBlock[] = response.data.map(block => ({
      ...block,
      startsAt: convertUTCStringToLocalDate(block.startsAt).toISOString(),
      endsAt: convertUTCStringToLocalDate(block.endsAt).toISOString(),
    }))

    return {
      data: blocks,
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
