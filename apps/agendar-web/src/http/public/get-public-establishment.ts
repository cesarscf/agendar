import { api } from "@/lib/api-client"

export type PublicAvailability = {
  id: string
  establishmentId: string
  weekday: number
  opensAt: string
  closesAt: string
  breakStart: string | null
  breakEnd: string | null
}

export type PublicEstablishment = {
  id: string
  name: string
  address: string | null
  phone: string | null
  theme: string
  about: string | null
  slug: string
  logoUrl: string | null
  bannerUrl: string | null
  servicesPerformed: string | null
  activeCustomers: string | null
  experienceTime: string | null
  googleMapsLink: string | null
  active: boolean
  availabilities: PublicAvailability[]
}

export async function getPublicEstablishment(slug: string) {
  const response = await api.get<PublicEstablishment>(`/public/${slug}`)

  return response.data
}
