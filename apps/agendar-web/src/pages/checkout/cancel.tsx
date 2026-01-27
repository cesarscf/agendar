import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute("/checkout/cancel")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Cancelado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            O processo de pagamento foi cancelado. Nenhuma cobrança foi
            realizada.
          </p>

          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate({ to: "/" })} className="w-full">
              Voltar para Planos
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/app" })}
              className="w-full"
            >
              Ir para o Painel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
