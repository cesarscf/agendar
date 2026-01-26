import { api } from "@/lib/api-client"
import { convertUTCToLocalTime } from "@/lib/utils"
import type { EmployeeRecurringBlock } from "@/lib/validations/blocks"

export async function getEmployeeRecurringBlocks(employeeId: string) {
  const response = await api.get<EmployeeRecurringBlock[]>(
    `/employees/${employeeId}/recurring-blocks`
  )

  return response.data.map(block => ({
    ...block,
    startTime: convertUTCToLocalTime(block.startTime),
    endTime: convertUTCToLocalTime(block.endTime),
  }))
}
