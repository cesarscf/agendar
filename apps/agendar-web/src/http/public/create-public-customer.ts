import { api } from "@/lib/api-client";
import { onlyNumbers, parseDateString } from "@/lib/utils";

import type { CreateCustomerRequest } from "@/lib/validations/customer";

export async function createPublicCustomer(
  inputs: CreateCustomerRequest & { slug: string },
) {
  const payload = {
    ...inputs,
    phoneNumber: inputs.phoneNumber
      ? onlyNumbers(inputs.phoneNumber)
      : undefined,
    birthDate: inputs.birthDate ? parseDateString(inputs.birthDate) : undefined,
  };

  const response = await api.post<{
    id: string;
  }>(`/public/customers/${inputs.slug}`, payload);

  return response.data;
}
