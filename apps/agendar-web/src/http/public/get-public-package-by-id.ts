import { api } from "@/lib/api-client"

export type PublicPackageById = {
  serviceId: string
  id: string
  name: string
  description: string | null
  price: string
  image: string | null
  totalServices: number
}

export async function getPublicPackageById({
  slug,
  packageId,
}: {
  slug: string
  packageId: string
}) {
  const response = await api.get<PublicPackageById>(
    `/public/${slug}/packages/${packageId}`
  )

  return response.data
}
