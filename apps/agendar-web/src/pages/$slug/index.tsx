import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import {
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Phone,
  TriangleAlert,
  Users,
} from "lucide-react"
import React from "react"
import { ThemeWrapper } from "@/components/theme-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublicEstablishment } from "@/http/public/get-public-establishment"
import { getPublicLoyalties } from "@/http/public/get-public-loyalties"
import { getPublicPackages } from "@/http/public/get-public-packages"
import { getPublicProfessionals } from "@/http/public/get-public-professionals"
import { getPublicServices } from "@/http/public/get-public-services"
import { maskPhone } from "@/lib/masks"
import { cn } from "@/lib/utils"
import { EstablishmentFooter } from "./-components/establishment-footer"
import { EstablishmentHeader } from "./-components/establishment-header"
import { EstablishmentHeroBanner } from "./-components/establishment-hero-banner"
import { EstablishmentLoyaltyProgramsList } from "./-components/establishment-loyalty-programs-list"
import { EstablishmentPackagesList } from "./-components/establishment-package-list"
import { EstablishmentProfessionalsList } from "./-components/establishment-professionals-list"
import { EstablishmentServicesList } from "./-components/establishment-service-list"
import { EstablishmentSidebar } from "./-components/establishment-sidebar"

export const Route = createFileRoute("/$slug/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const slug = params.slug

    const data = await getPublicEstablishment(slug)

    return {
      ...data,
    }
  },
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          name: "description",
          content: loaderData?.about ?? "",
        },
        {
          title: loaderData?.name ?? "Agendar",
        },
      ],
      links: [
        {
          rel: "icon",
          href: "/favicon.ico",
        },
      ],
    }
  },
})

function RouteComponent() {
  const establishment = Route.useLoaderData()

  const { slug } = Route.useParams()
  const [activeTab, setActiveTab] = React.useState("services")

  const { data: services, isLoading: servicesIsLoading } = useQuery({
    queryKey: ["public", "services", slug],
    queryFn: () => getPublicServices(slug),
  })

  const { data: professionals, isLoading: professionalsIsLoading } = useQuery({
    queryKey: ["public", "professionals", slug],
    queryFn: () => getPublicProfessionals(slug),
  })

  const { data: packages, isLoading: _packagesIsLoading } = useQuery({
    queryKey: ["public", "packages", slug],
    queryFn: () => getPublicPackages(slug),
  })

  const { data: loyalties, isLoading: _loyaltiesIsLoading } = useQuery({
    queryKey: ["public", "loyalties", slug],
    queryFn: () => getPublicLoyalties(slug),
  })

  const isLoading = professionalsIsLoading || servicesIsLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex-1 w-full flex justify-center items-center">
        <Loader2 className="size-16 animate-spin" />
      </div>
    )
  }

  if (!establishment) {
    return (
      <div className="min-h-screen bg-background flex-1 w-full flex justify-center items-center">
        <TriangleAlert className="size-28" />
      </div>
    )
  }

  if (!establishment.active) {
    return (
      <div className="min-h-screen bg-background flex-1 w-full flex justify-center items-center">
        <div className="grid gap-2">
          <TriangleAlert className="size-28" />
          <p>Esta loja está desativada no momento</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeWrapper theme={establishment.theme}>
      <div className="fade-in min-h-screen bg-background p-2 sm:px-4 lg:flex lg:flex-col lg:justify-center lg:px-4">
        <div className="max-w-7xl mx-auto w-full">
          <EstablishmentHeader establishment={establishment} slug={slug} />
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              <EstablishmentHeroBanner establishment={establishment} />

              {/* Mobile: Contact cards at the top */}
              <div className="lg:hidden mt-4 space-y-4">
                {/* Location Card */}
                <Card className="p-4 bg-card border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-semibold text-card-foreground">
                      Localização
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground text-balance">
                    {establishment.address}
                  </p>
                  {establishment.googleMapsLink && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full"
                      asChild
                    >
                      <a
                        href={establishment.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        Ver no Mapa
                      </a>
                    </Button>
                  )}
                </Card>

                {/* Phone Card */}
                {establishment.phone && (
                  <Card className="p-4 bg-card border-border gap-2">
                    <h4 className="font-semibold text-card-foreground">
                      Contato
                    </h4>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-card-foreground">
                        {maskPhone(establishment.phone)}
                      </span>
                    </div>
                  </Card>
                )}
              </div>

              {establishment.about && (
                <Card className="mt-4 gap-2 md:mr-6">
                  <CardHeader>
                    <CardTitle>Sobre nós</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {establishment.about}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="mt-4 gap-2 md:mr-6">
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center">
                      <CheckCircle className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-lg font-semibold">
                        {establishment.servicesPerformed ?? "—"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Serviços Realizados
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Users className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-lg font-semibold">
                        {establishment.activeCustomers ?? "—"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Clientes Ativos
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Clock className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-lg font-semibold">
                        {establishment.experienceTime ?? "—"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Tempo de Experiência
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div
                id="tabs"
                className="flex gap-4 sm:gap-6 px-4 sm:px-6 py-4 bg-background border-b border-border overflow-x-auto"
              >
                {services && services?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("services")}
                    className={cn(
                      "text-sm font-medium pb-2 whitespace-nowrap text-muted-foreground hover:text-foreground border-0 cursor-pointer",
                      {
                        "text-foreground border-b-2 border-primary":
                          activeTab === "services",
                      }
                    )}
                  >
                    Serviços
                  </button>
                )}

                {professionals && professionals?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("professionals")}
                    className={cn(
                      "text-sm font-medium pb-2 whitespace-nowrap text-muted-foreground hover:text-foreground border-0 cursor-pointer",
                      {
                        "text-foreground border-b-2 border-primary":
                          activeTab === "professionals",
                      }
                    )}
                  >
                    Profissionais
                  </button>
                )}

                {packages && packages?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("packages")}
                    className={cn(
                      "text-sm font-medium pb-2 whitespace-nowrap text-muted-foreground hover:text-foreground border-0 cursor-pointer",
                      {
                        "text-foreground border-b-2 border-primary":
                          activeTab === "packages",
                      }
                    )}
                  >
                    Pacotes
                  </button>
                )}

                {loyalties && loyalties?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("loyalties")}
                    className={cn(
                      "text-sm font-medium pb-2 whitespace-nowrap text-muted-foreground hover:text-foreground border-0 cursor-pointer",
                      {
                        "text-foreground border-b-2 border-primary":
                          activeTab === "loyalties",
                      }
                    )}
                  >
                    Fidelidade
                  </button>
                )}
              </div>
              {activeTab === "services" && (
                <EstablishmentServicesList services={services ?? []} />
              )}
              {activeTab === "professionals" && (
                <EstablishmentProfessionalsList
                  professionals={professionals ?? []}
                />
              )}
              {activeTab === "packages" && (
                <EstablishmentPackagesList packages={packages ?? []} />
              )}

              {activeTab === "loyalties" && (
                <EstablishmentLoyaltyProgramsList programs={loyalties ?? []} />
              )}
            </div>
            <EstablishmentSidebar establishment={establishment} />
          </div>
        </div>
        <EstablishmentFooter />
      </div>
    </ThemeWrapper>
  )
}
