import { api } from "../api-client"
import type { EmployeeRecurringBlock } from "@/lib/validations/blocks"
import { handleApiError, convertUTCToLocalTime } from "@/utils"

interface EmployeeRecurringBlockResponse {
  id: string
  weekday: number
  startTime: string
  endTime: string
  reason: string
}

export async function getEmployeeRecurringBlocks(employeeId: string) {
  try {
    const response = await api.get<EmployeeRecurringBlockResponse[]>(
      `/employees/${employeeId}/recurring-blocks`
    )

    const blocks: EmployeeRecurringBlock[] = response.data.map(block => ({
      ...block,
      startTime: convertUTCToLocalTime(block.startTime),
      endTime: convertUTCToLocalTime(block.endTime),
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
