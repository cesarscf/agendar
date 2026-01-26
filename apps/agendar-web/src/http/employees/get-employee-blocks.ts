import { api } from "@/lib/api-client"
import { convertUTCStringToLocal } from "@/lib/utils"
import type { EmployeeBlock } from "@/lib/validations/blocks"

export async function getEmployeeBlocks(employeeId: string) {
  const response = await api.get<
    Array<
      Omit<EmployeeBlock, "startsAt" | "endsAt"> & {
        startsAt: string
        endsAt: string
      }
    >
  >(`/employees/${employeeId}/blocks`)

  return response.data.map(block => ({
    ...block,
    startsAt: new Date(convertUTCStringToLocal(block.startsAt)),
    endsAt: new Date(convertUTCStringToLocal(block.endsAt)),
  }))
}
