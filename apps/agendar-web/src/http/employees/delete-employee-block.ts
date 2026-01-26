import { api } from "@/lib/api-client"

export async function deleteEmployeeBlock(blockId: string) {
  await api.delete(`/blocks/${blockId}`)
}
