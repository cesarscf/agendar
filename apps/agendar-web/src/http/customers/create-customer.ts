import { api } from "@/lib/api-client";
import { onlyNumbers, parseDateString } from "@/lib/utils";
import type { CreateCustomerRequest } from "@/lib/validations/customer";

export async function createCustomer(inputs: CreateCustomerRequest) {
  const payload = {
    ...inputs,
    phoneNumber: inputs.phoneNumber
      ? onlyNumbers(inputs.phoneNumber)
      : undefined,
    birthDate: inputs.birthDate ? parseDateString(inputs.birthDate) : undefined,
    cpf: inputs.cpf ? onlyNumbers(inputs.cpf) : undefined,
  };

  await api.post("/customers", payload);
}
