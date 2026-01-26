import { api } from "@/lib/api-client";

export async function deleteCustomer(customerId: string) {
  await api.delete(`/customers/${customerId}`);
}
