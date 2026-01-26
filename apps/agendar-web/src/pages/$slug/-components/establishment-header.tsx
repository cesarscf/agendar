import { Button } from "@/components/ui/button"
import type { PublicEstablishment } from "@/http/public/get-public-establishment"
import { CustomerSearch } from "./customer-search"

export function EstablishmentHeader({
  establishment,
  slug,
}: {
  establishment: PublicEstablishment
  slug: string
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-background">
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src={establishment.logoUrl ?? ""}
          alt={establishment.name}
          className="size-15 rounded-2xl object-cover opacity-80"
        />
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">
            {establishment.name}
          </h1>

          <span className="text-sm text-muted-foreground">
            {establishment.slug}
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <CustomerSearch slug={slug} compact />
        <Button
          className="flex-1 sm:flex-none whitespace-nowrap"
          onClick={() => {
            const tabsElement = document.getElementById("tabs")
            if (tabsElement) {
              tabsElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          }}
        >
          Agendar agora
        </Button>
      </div>
    </div>
  )
}
