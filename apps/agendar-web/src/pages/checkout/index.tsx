import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  ChevronLeft,
  CreditCard,
  DollarSign,
  Gift,
  Loader2,
  Shield,
  Users,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useSubscription } from "@/hooks/use-subscription"
import { createCheckoutSession } from "@/http/payments/create-checkout-session"
import { createCustomerPortal } from "@/http/payments/create-customer-portal"
import { getPlan } from "@/http/payments/get-plan"

type CheckoutParams = {
  planId: string
}

export const Route = createFileRoute("/checkout/")({
  component: RouteComponent,
  validateSearch: (search: CheckoutParams) => {
    return {
      planId: search.planId,
    }
  },
})

function RouteComponent() {
  const { planId } = Route.useSearch()
  const navigate = useNavigate()

  const { partner, isLoading: partnerIsLoading } = useAuth()
  const { currentSubscription, hasActiveSubscription } = useSubscription()

  const { data: plan, isLoading: planIsLoading } = useQuery({
    queryKey: ["plan", planId],
    queryFn: () => getPlan(planId),
    enabled: !!planId,
  })

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: () => createCheckoutSession(planId),
    onSuccess: data => {
      // Redirect to Stripe Checkout
      window.location.href = data.url
    },
  })

  const { mutate: openPortal, isPending: isOpeningPortal } = useMutation({
    mutationFn: createCustomerPortal,
    onSuccess: data => {
      // Redirect to Stripe Customer Portal
      window.location.href = data.url
    },
  })

  // Redirect if not logged in
  if (!partner && !partnerIsLoading) {
    navigate({
      to: "/login",
      search: {
        redirect: location.pathname + location.search,
      },
    })
    return null
  }

  // Redirect if no planId
  if (!planId) {
    navigate({ to: "/" })
    return null
  }

  // Check if this is an upgrade (already has subscription with different plan)
  const isUpgrade =
    hasActiveSubscription && currentSubscription?.plan?.id !== planId

  // Already subscribed to this plan
  const isCurrentPlan =
    hasActiveSubscription && currentSubscription?.plan?.id === planId

  if (partnerIsLoading || planIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Plano não encontrado.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        size="icon"
        className="mb-4"
        variant="outline"
        onClick={() => navigate({ to: "/" })}
      >
        <ChevronLeft />
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isUpgrade ? "Alterar Plano" : "Assinar Plano"}
        </h1>
        <p className="text-gray-600">
          {isUpgrade
            ? "Você será redirecionado para o portal de pagamentos para alterar seu plano."
            : `Complete sua assinatura do plano ${plan.name}.`}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumo do Plano</CardTitle>
          <CardDescription>Detalhes da assinatura selecionada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            {plan.trialPeriodDays > 0 && (
              <Badge variant="secondary">
                {plan.trialPeriodDays} dias grátis
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{plan.description}</p>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Valor</span>
              </div>
              <span className="font-semibold">
                R$ {plan.price} /{" "}
                {plan.intervalMonth > 1 ? `${plan.intervalMonth} meses` : "mês"}
              </span>
            </div>

            {plan.trialPeriodDays > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Período gratuito</span>
                </div>
                <span className="text-sm">{plan.trialPeriodDays} dias</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Profissionais</span>
              </div>
              <span className="text-sm">
                {plan.minimumProfessionalsIncluded} -{" "}
                {plan.maximumProfessionalsIncluded}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total hoje</span>
            <span>R$ 0,00</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {plan.trialPeriodDays > 0
              ? `Você será cobrado R$ ${plan.price} após ${plan.trialPeriodDays} dias.`
              : `Você será cobrado R$ ${plan.price} imediatamente.`}
          </p>
        </CardContent>
      </Card>

      {isCurrentPlan ? (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Você já está inscrito neste plano.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Pagamento seguro via Stripe
              </p>
              <p className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Cartão de crédito ou débito
              </p>
            </div>

            {isUpgrade ? (
              <Button
                onClick={() => openPortal()}
                disabled={isOpeningPortal}
                className="w-full"
                size="lg"
              >
                {isOpeningPortal ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecionando...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Gerenciar Assinatura
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => checkout()}
                disabled={isCheckingOut}
                className="w-full"
                size="lg"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecionando...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Continuar para Pagamento
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
