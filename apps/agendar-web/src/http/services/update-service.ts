import { api } from "@/lib/api-client";
import { convertUnmaskedToCents, parseDuration } from "@/lib/utils";
import type { UpdateServiceRequest } from "@/lib/validations/service";

export async function updateService(inputs: UpdateServiceRequest) {
  const payload = {
    ...inputs,
    durationInMinutes: inputs.durationInMinutes
      ? parseDuration(inputs.durationInMinutes)
      : undefined,
    price: inputs.price ? convertUnmaskedToCents(inputs.price) : undefined,
  };

  await api.put(`/services/${payload.id}`, payload);
}
