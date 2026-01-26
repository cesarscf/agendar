import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { useQueryState } from "nuqs"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { getPackage } from "@/http/packages/get-package"
import { getServices } from "@/http/services/get-services"
import { UpdatePackageForm } from "./-components/update-package-form"

export const Route = createFileRoute("/app/packages/$packageId/")({
  component: Package,
})

function Package() {
  const { packageId } = Route.useParams()
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["package", packageId],
    queryFn: () => getPackage(packageId),
  })

  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "update-package",
  })

  if (isLoading) {
    return null
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Pacote não encontrado.
      </div>
    )
  }

  return (
    <div className="p-6">
      <Tabs value={tab} onValueChange={setTab}>
        {/* <div className="flex items-center gap-4 mb-4">
          <Button size="icon" variant="outline" asChild>
            <Link to="/app/packages">
              <ChevronLeft />
            </Link>
          </Button>
          <TabsList>
            <TabsTrigger value="update-package">Atualizar pacote</TabsTrigger>
            <TabsTrigger value="package-items">Items do pacote</TabsTrigger>
          </TabsList>
        </div> */}
        <TabsContent value="update-package">
          <div className="my-4">
            <h1 className="text-2xl font-bold text-foreground">
              Atualizar pacote
            </h1>
            <p className="text-muted-foreground">
              Atualize o pacote {data.name}
            </p>
          </div>
          <UpdatePackageForm pkg={data} services={services ?? []} />
        </TabsContent>
        {/* <TabsContent value="package-items">
          <div className="my-4">
            <h1 className="text-2xl font-bold text-foreground">
              Items do pacote
            </h1>
            <p className="text-muted-foreground">
              Gerencie os items do pacote {data.name}
            </p>
          </div>

          <UpdatePackageItemForm
            items={data.items}
            services={services ?? []}
            packageId={packageId}
          />
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
