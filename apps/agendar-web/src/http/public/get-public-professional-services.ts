import { api } from "@/lib/api-client";
import type { PublicService } from "./get-public-services";

export async function getPublicProfessionalServices({
  slug,
  employeeId,
}: {
  slug: string;
  employeeId: string;
}) {
  const response = await api.get<PublicService[]>(
    `/public/${slug}/professionals/${employeeId}/services`,
  );

  return response.data;
}
