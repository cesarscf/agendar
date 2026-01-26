import { api } from "@/lib/api-client";
import type { PublicService } from "./get-public-services";

export async function getPublicServiceById({
  slug,
  serviceId,
}: {
  slug: string;
  serviceId: string;
}) {
  const response = await api.get<PublicService>(
    `/public/${slug}/services/${serviceId}`,
  );

  return response.data;
}
