import { api } from "@/lib/api-client";
import { onlyNumbers } from "@/lib/utils";
import type { UpdateEstablishmentRequest } from "@/lib/validations/establishment";

export async function updateEstablishment(inputs: UpdateEstablishmentRequest) {
  const payload = {
    ...inputs,
    phone: inputs.phone ? onlyNumbers(inputs.phone) : undefined,
  };

  await api.put(`/establishments`, payload);
}
