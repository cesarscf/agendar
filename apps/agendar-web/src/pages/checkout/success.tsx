import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { CheckCircle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute("/checkout/success")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Invalidate queries to refresh subscription status
    queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
    queryClient.invalidateQueries({ queryKey: ["partner"] })

    // Countdown and redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate({ to: "/app" })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, queryClient])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Assinatura Confirmada!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Sua assinatura foi processada com sucesso. Você já pode aproveitar
            todos os recursos do plano.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecionando em {countdown} segundos...
          </div>

          <Button onClick={() => navigate({ to: "/app" })} className="w-full">
            Ir para o Painel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
