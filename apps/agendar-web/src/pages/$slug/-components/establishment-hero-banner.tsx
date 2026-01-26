import type { PublicEstablishment } from "@/http/public/get-public-establishment"

export function EstablishmentHeroBanner({
  establishment,
}: {
  establishment: PublicEstablishment
}) {
  return (
    <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
      <img
        src={establishment.bannerUrl ?? ""}
        alt={establishment.bannerUrl ?? ""}
        className="w-full h-full object-cover opacity-95"
      />
    </div>
  )
}
