import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLoyaltyProgram } from "@/http/loyalty/get-loyalty-program"
import { getServices } from "@/http/services/get-services"
import { UpdateLoyaltyProgram } from "./-components/update-loyalty-program"

export const Route = createFileRoute("/app/loyalty-programs/$programId/")({
  component: LoyaltyProgram,
})

function LoyaltyProgram() {
  const { programId } = Route.useParams()

  const { data, isLoading } = useQuery({
    queryKey: ["loyalty-program", programId],
    queryFn: () => getLoyaltyProgram(programId),
  })

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  })

  if (isLoading) {
    return null
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Programa não encontrado.
      </div>
    )
  }

  return (
    <div className="p-6">
      <Button size="icon" variant="outline" asChild>
        <Link to="/app/loyalty-programs">
          <ChevronLeft />
        </Link>
      </Button>

      <div className="my-4">
        <h1 className="text-2xl font-bold text-foreground">
          Atualizar programa de fidelidade
        </h1>
        <p className="text-muted-foreground">
          Atualize o programa de fidelidade e suas regras.
        </p>
      </div>
      <UpdateLoyaltyProgram program={data} services={services ?? []} />
    </div>
  )
}
