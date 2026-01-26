import { api } from "@/lib/api-client";

export async function deleteEmployeeRecurringBlock(recurringBlockId: string) {
  await api.delete(`/recurring-blocks/${recurringBlockId}`);
}
