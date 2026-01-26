import { api } from "@/lib/api-client";

export type PublicService = {
  id: string;
  name: string;
  description: string;
  price: string;
  durationInMinutes: number;
  image: string;
};

export async function getPublicServices(slug: string) {
  const response = await api.get<PublicService[]>(`/public/${slug}/services`);

  return response.data;
}
