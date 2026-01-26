import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ArrowRight, Hammer, PackageSearch } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getPackages } from "@/http/packages/get-packages"
import { formatPriceFromCents } from "@/lib/utils"

export const Route = createFileRoute("/app/packages/")({
  component: Packages,
})

function Packages() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-20" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Pacotes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus pacotes de serviços
          </p>
        </div>
        <Button asChild>
          <Link to="/app/packages/new">Adicionar</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map(pkg => (
          <Card
            key={pkg.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border"
            onClick={() =>
              navigate({
                to: "/app/packages/$packageId",
                params: { packageId: pkg.id },
              })
            }
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {pkg.image ? (
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="object-cover w-12 h-12 rounded-xl border-2 border-border/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <PackageSearch className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground text-base leading-tight group-hover:text-primary transition-colors">
                      {pkg.name}
                    </h3>
                    {pkg.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                </div>
                <Badge
                  variant={pkg.active ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {pkg.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Preço:</span>
                <span className="font-medium text-foreground">
                  {formatPriceFromCents(pkg.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comissão:</span>
                <span className="font-medium text-foreground">
                  {pkg.commission}%
                </span>
              </div>

              <div className="pt-2 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between group-hover:bg-primary/10 transition-colors"
                >
                  Ver detalhes
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data?.length === 0 && (
        <div className="text-center py-12">
          <Hammer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum pacote encontrado
          </h3>
          <p className="text-muted-foreground">
            Comece criando seu primeiro pacote de serviços
          </p>
        </div>
      )}
    </div>
  )
}
