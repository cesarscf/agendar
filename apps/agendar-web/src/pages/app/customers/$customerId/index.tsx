import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEstablishment } from "@/hooks/use-establishment"
import { getCustomer } from "@/http/customers/get-customer"
import { CustomerLoyaltyPrograms } from "./-components/customer-loyalty-programs"
import { CustomerPackages } from "./-components/customer-packages"
import { UpdateCustomerForm } from "./-components/update-customer-form"

export const Route = createFileRoute("/app/customers/$customerId/")({
  component: Customer,
})

function Customer() {
  const { customerId } = Route.useParams()
  const { establishment } = useEstablishment()

  const { data, isLoading } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomer(customerId),
    enabled: !!customerId,
  })

  if (!data || isLoading) {
    return null
  }

  if (!data) {
    return null
  }

  return (
    <div className="p-6">
      <Button size="icon" variant="outline" asChild>
        <Link to="/app/customers">
          <ChevronLeft />
        </Link>
      </Button>

      <div className="my-4">
        <h1 className="text-2xl font-bold text-foreground">{data.name}</h1>
        <p className="text-muted-foreground">
          Gerenciar informações do cliente
        </p>
      </div>

      <Tabs defaultValue="information" className="w-full">
        <TabsList>
          <TabsTrigger value="information">Informações</TabsTrigger>
          <TabsTrigger value="packages">Pacotes</TabsTrigger>
          <TabsTrigger value="loyalty">Programas de Fidelidade</TabsTrigger>
        </TabsList>

        <TabsContent value="information" className="mt-6">
          <UpdateCustomerForm customer={data} />
        </TabsContent>

        <TabsContent value="packages" className="mt-6">
          <CustomerPackages customerId={customerId} />
        </TabsContent>

        <TabsContent value="loyalty" className="mt-6">
          {data.phoneNumber && establishment?.id ? (
            <CustomerLoyaltyPrograms
              customerPhone={data.phoneNumber}
              establishmentId={establishment.id}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {!data.phoneNumber
                  ? "Telefone do cliente é necessário para visualizar os programas de fidelidade."
                  : "Carregando informações do estabelecimento..."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
