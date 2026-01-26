import { api } from "@/lib/api-client";
import type { Customer } from "@/lib/validations/customer";

export async function getCustomers() {
  const response = await api.get<Customer[]>("/customers");

  return response.data;
}
