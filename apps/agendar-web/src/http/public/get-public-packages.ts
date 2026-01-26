import { api } from "@/lib/api-client";

export type PublicPackage = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  image: string | null;
  totalServices: number;
};

export async function getPublicPackages(slug: string) {
  const response = await api.get<PublicPackage[]>(`/public/${slug}/packages`);

  return response.data;
}
