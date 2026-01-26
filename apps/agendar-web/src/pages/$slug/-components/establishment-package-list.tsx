import { useNavigate, useParams } from "@tanstack/react-router"
import { Gift, Search } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PublicPackage } from "@/http/public/get-public-packages"
import { formatPriceFromCents } from "@/lib/utils"

export function EstablishmentPackagesList({
  packages,
}: {
  packages: PublicPackage[]
}) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredPackages = React.useMemo(() => {
    if (!searchTerm.trim()) return packages

    return packages.filter(
      pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [packages, searchTerm])

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Pacotes</h3>

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
        {filteredPackages.map(pkg => (
          <PackageItem key={pkg.id} pkg={pkg} />
        ))}
        {filteredPackages.length === 0 && searchTerm.trim() && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum pacote encontrado para "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}

function PackageItem({ pkg }: { pkg: PublicPackage }) {
  const navigate = useNavigate()
  const { slug } = useParams({ from: "/$slug" })

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {pkg.image ? (
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Gift className="w-10 h-10 text-primary" />
          </div>
        )}
        <div className="flex flex-col">
          <h4 className="font-medium text-card-foreground text-base sm:text-lg">
            {pkg.name}
          </h4>
          {pkg.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
              {pkg.description}
            </p>
          )}
          <p className="text-sm sm:text-base font-semibold text-foreground mt-1">
            {formatPriceFromCents(pkg.price)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 w-full sm:w-auto">
        <Button
          onClick={() => {
            navigate({
              to: "/$slug/scheduling",
              params: { slug },
              search: {
                professionalId: undefined,
                serviceId: undefined,
                packageId: pkg.id,
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
