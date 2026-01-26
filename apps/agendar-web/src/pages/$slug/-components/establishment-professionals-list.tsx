import { useNavigate, useParams } from "@tanstack/react-router"
import { Search, User } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PublicProfessional } from "@/http/public/get-public-professionals"

export function EstablishmentProfessionalsList({
  professionals,
}: {
  professionals: PublicProfessional[]
}) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredProfessionals = React.useMemo(() => {
    if (!searchTerm.trim()) return professionals

    return professionals.filter(
      professional =>
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.biography?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [professionals, searchTerm])

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Profissionais
      </h3>
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
        {filteredProfessionals.map(prof => (
          <ProfessionalItem key={prof.id} prof={prof} />
        ))}
        {filteredProfessionals.length === 0 && searchTerm.trim() && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum profissional encontrado para "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}

function ProfessionalItem({ prof }: { prof: PublicProfessional }) {
  const navigate = useNavigate()
  const { slug } = useParams({ from: "/$slug" })

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {prof.avatarUrl ? (
          <img
            src={prof.avatarUrl}
            alt={prof.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
        )}

        <div className="flex flex-col">
          <h4 className="font-medium text-card-foreground text-base sm:text-lg">
            {prof.name}
          </h4>
          {prof.biography && (
            <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
              {prof.biography}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 w-full sm:w-auto">
        <Button
          onClick={() => {
            navigate({
              to: "/$slug/scheduling",
              params: { slug },
              search: {
                professionalId: prof.id,
                serviceId: undefined,
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
