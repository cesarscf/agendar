import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { useQueryState } from "nuqs"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEstablishment } from "@/hooks/use-establishment"
import { getEstablishmentAvailability } from "@/http/establishment/get-establishment-availability"
import { UpdateAvailabilityForm } from "./-components/update-availability-form"
import { UpdateStoreForm } from "./-components/update-store-form"

export const Route = createFileRoute("/app/store/")({
  component: Store,
})

function Store() {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "geral",
  })

  const { establishment, isLoading } = useEstablishment()

  const { data: availabilities, isLoading: availabilityIsLoading } = useQuery({
    queryKey: ["availabilities"],
    queryFn: getEstablishmentAvailability,
  })

  return (
    <div className="p-6">
      <Tabs
        value={tab || "geral"}
        onValueChange={value => {
          setTab(value)
        }}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row gap-4 md:items-center w-full">
          <Button size="icon" variant="outline" asChild>
            <Link to="/app/employees">
              <ChevronLeft />
            </Link>
          </Button>
          <TabsList className="grid grid-cols-2 w-full md:w-auto">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="availability">Funcionamento</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="geral">
          <div className="my-4">
            <h1 className="text-2xl font-bold text-foreground">
              Informações da loja
            </h1>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Carregando dados da loja...
                </p>
              </div>
            </div>
          ) : establishment ? (
            <UpdateStoreForm establishment={establishment} />
          ) : null}
        </TabsContent>
        <TabsContent value="availability">
          <div className="my-4">
            <h1 className="text-2xl font-bold text-foreground">
              Funcionamento da loja
            </h1>
          </div>

          {availabilityIsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Carregando horários de funcionamento...
                </p>
              </div>
            </div>
          ) : (
            <UpdateAvailabilityForm availabilities={availabilities ?? []} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
