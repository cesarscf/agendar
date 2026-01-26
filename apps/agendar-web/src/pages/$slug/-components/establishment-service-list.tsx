import { useNavigate, useParams } from "@tanstack/react-router"
import { Clock, Scissors, Search } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PublicService } from "@/http/public/get-public-services"
import { formatPriceFromCents } from "@/lib/utils"

export function EstablishmentServicesList({
  services,
}: {
  services: PublicService[]
}) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredServices = React.useMemo(() => {
    if (!searchTerm.trim()) return services

    return services.filter(
      service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [services, searchTerm])

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Serviços</h3>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar"
          className="pl-10 bg-background border-border text-foreground"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredServices.map(service => (
          <ServiceItem key={service.id} service={service} />
        ))}
        {filteredServices.length === 0 && searchTerm.trim() && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum serviço encontrado para "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}

function ServiceItem({ service }: { service: PublicService }) {
  const navigate = useNavigate()
  const { slug } = useParams({ from: "/$slug" })

  const formattedPrice = formatPriceFromCents(service.price)
  const formattedDuration = `${service.durationInMinutes} min`

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex-shrink-0">
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-lg flex items-center justify-center">
              <Scissors className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="font-medium text-card-foreground text-base sm:text-lg">
            {service.name}
          </h4>
          {service.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
              {service.description}
            </p>
          )}
          <div className="flex flex-row gap-4 items-center mt-2">
            <p className="text-sm sm:text-base font-semibold text-green-600 ">
              {formattedPrice}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formattedDuration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
        <Button
          onClick={() => {
            navigate({
              to: "/$slug/scheduling",
              params: { slug },
              search: {
                professionalId: undefined,
                serviceId: service.id,
                packageId: undefined,
              },
            })
          }}
        >
          Agendar
        </Button>
      </div>
    </div>
  )
}
