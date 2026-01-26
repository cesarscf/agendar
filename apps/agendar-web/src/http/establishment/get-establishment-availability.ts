import { api } from "@/lib/api-client";
import type { Availability } from "@/lib/validations/availability";

export async function getEstablishmentAvailability() {
  const response = await api.get<Availability[]>(
    "/establishments/availability",
  );

  return response.data;
}
