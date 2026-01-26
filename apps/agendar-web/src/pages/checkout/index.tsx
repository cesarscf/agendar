import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  DollarSign,
  Gift,
  Loader2,
  Mail,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { createPartnerSubscribe } from "@/http/payments/create-partner-subscribe";
import { getPaymentMethods } from "@/http/payments/get-payment-methods";
import { getPlan } from "@/http/payments/get-plan";
import { getSetupIntent } from "@/http/payments/get-setup-intent";
import { updateSubscription } from "@/http/payments/update-subscription";
import { paymentMethodSchema } from "@/lib/validations/payment-method";

type CheckoutParams = {
  planId: string;
};

export const Route = createFileRoute("/checkout/")({
  component: RouteComponent,
  validateSearch: (search: CheckoutParams) => {
    return {
      planId: search.planId,
    };
  },
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function RouteComponent() {
  const { planId } = Route.useSearch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { partner, isLoading: partnerIsLoading } = useAuth();
  const { subscriptions } = useSubscription();

  const { data: plan, isLoading: planIsLoading } = useQuery({
    queryKey: ["plan", planId],
    queryFn: () => getPlan(planId),
  });

  const { data: paymentMethodsRaw, isLoading: paymentMethodsLoading } =
    useQuery({
      queryKey: ["payment-methods"],
      queryFn: getPaymentMethods,
      enabled:
        !!planId &&
        !!subscriptions &&
        subscriptions.length > 0 &&
        subscriptions[0]?.plan.id !== planId,
    });

  const paymentMethods = paymentMethodsRaw
    ? paymentMethodsRaw
        .map((pm) => {
          const parsed = paymentMethodSchema.safeParse(pm);
          return parsed.success ? parsed.data : null;
        })
        .filter(Boolean)
    : [];

  const {
    mutateAsync: updateSubscriptionMutate,
    isPending: updatingSubscription,
  } = useMutation({
    mutationFn: () => updateSubscription(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  const subscription = subscriptions?.[0];
  const currentPlanId = subscription?.plan.id;
  const isSubscriptionActive = ["active", "trialing", "past_due"].includes(
    subscription?.status ?? "",
  );
  const isUpgrade =
    currentPlanId && currentPlanId !== planId && isSubscriptionActive;

  if (!planId) {
    navigate({ to: "/" });
    return null;
  }

  if (!partner && !partnerIsLoading) {
    navigate({
      to: "/login",
      search: {
        redirect: location.pathname + location.search,
      },
    });
    return null;
  }

  if (planId === currentPlanId && isSubscriptionActive) {
    navigate({ to: "/app" });
    return null;
  }

  async function handlePayment() {
    if (isUpgrade && cardToShow) {
      try {
        setLoading(true);
        setError(null);
        await updateSubscriptionMutate();
        setSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        queryClient.invalidateQueries({ queryKey: ["partner"] });
        queryClient.invalidateQueries({ queryKey: ["plans"] });
        setTimeout(() => {
          navigate({ to: "/app" });
        }, 2000);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro inesperado ao atualizar assinatura.";
        setError(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!stripe || !elements || !partner || !plan) {
      setError("Stripe não foi carregado corretamente.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Elemento do cartão não encontrado.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const currentMethods = await getPaymentMethods();
      const initialMethodCount = currentMethods.length || 0;

      const { paymentMethod, error: paymentMethodError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (paymentMethodError || !paymentMethod) {
        throw new Error(
          paymentMethodError?.message || "Erro ao criar método de pagamento.",
        );
      }

      const setupIntent = await getSetupIntent();
      const { setupIntent: _confirmedSetupIntent, error: confirmError } =
        await stripe.confirmCardSetup(setupIntent.clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        throw new Error(
          confirmError.message || "Erro ao confirmar SetupIntent.",
        );
      }

      let attempts = 0;
      const maxAttempts = 6;

      while (attempts < maxAttempts) {
        await sleep(5000);
        const updatedMethods = await getPaymentMethods();

        if (updatedMethods.length <= initialMethodCount) {
          attempts++;
          continue;
        }

        const latestMethod = updatedMethods[0];
        await createPartnerSubscribe({
          cardId: latestMethod.id,
          planId: planId,
        });

        setSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["partner"] });
        queryClient.invalidateQueries({ queryKey: ["payment-methods"] });

        setTimeout(() => {
          navigate({ to: "/" });
        }, 2000);
        return;
      }

      throw new Error("Tempo excedido ao esperar o cartão ser registrado.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao processar pagamento.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (
    partnerIsLoading ||
    planIsLoading ||
    (isUpgrade && paymentMethodsLoading)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                {isUpgrade
                  ? "Upgrade realizado com sucesso! Redirecionando..."
                  : "Assinatura criada com sucesso! Redirecionando..."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cardToShow = paymentMethods?.[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        size="icon"
        className="mb-4"
        variant="outline"
        onClick={() => {
          navigate({ to: "/" });
        }}
      >
        <ChevronLeft />
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isUpgrade ? "Upgrade de Plano" : "Finalizar Assinatura"}
        </h1>
        <p className="text-gray-600">
          {isUpgrade
            ? `Você está atualizando sua assinatura para o plano ${plan.name}.`
            : `Confirme seus dados e complete a assinatura do plano ${plan.name}.`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Plano</CardTitle>
              <CardDescription>
                Detalhes da{" "}
                {isUpgrade ? "nova assinatura" : "assinatura selecionada"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <Badge variant="secondary">
                  {plan.trialPeriodDays > 0
                    ? `${plan.trialPeriodDays} dias grátis`
                    : "Sem trial"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Valor</span>
                  </div>
                  <span className="font-semibold">
                    R$ {plan.price} /{" "}
                    {plan.intervalMonth > 1
                      ? `${plan.intervalMonth} meses`
                      : "mês"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Período gratuito</span>
                  </div>
                  <span className="text-sm">{plan.trialPeriodDays} dias</span>
                </div>

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
                {isUpgrade
                  ? `A cobrança do novo plano de R$ ${plan.price} será feita após ${plan.trialPeriodDays} dias.`
                  : `Você será cobrado R$ ${plan.price} após ${plan.trialPeriodDays} dias.`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Cartão</CardTitle>
              <CardDescription>
                {isUpgrade && cardToShow
                  ? "Cartão atual usado para cobrança:"
                  : "Digite os dados do seu cartão para assinar"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isUpgrade && cardToShow && !paymentMethodsLoading ? (
                <div className="p-4 border rounded-lg bg-background text-center">
                  <p>
                    {cardToShow.brand.toUpperCase()} **** **** ****{" "}
                    {cardToShow.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Válido até {cardToShow.expMonth}/{cardToShow.expYear}
                  </p>
                </div>
              ) : paymentMethodsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="space-y-4">
                  {isUpgrade && !cardToShow && (
                    <Alert>
                      <AlertDescription>
                        Você não possui um cartão cadastrado. Adicione um cartão
                        abaixo para continuar com o upgrade do seu plano.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="p-4 border rounded-lg bg-background">
                    <CardElement
                      options={{
                        hidePostalCode: true,
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                              color: "#aab7c4",
                            },
                          },
                          invalid: {
                            color: "#9e2146",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Seus dados estão protegidos com criptografia SSL</p>
                <p>• Você pode cancelar a qualquer momento</p>
                <p>• Não há taxas de cancelamento</p>
              </div>

              <Button
                onClick={handlePayment}
                disabled={
                  loading ||
                  !stripe ||
                  !elements ||
                  paymentMethodsLoading ||
                  updatingSubscription
                }
                className="w-full"
                size="lg"
              >
                {loading || updatingSubscription ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    {isUpgrade && cardToShow
                      ? "Confirmar Upgrade"
                      : isUpgrade
                        ? "Adicionar Cartão e Fazer Upgrade"
                        : "Confirmar Assinatura"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações da Conta
              </CardTitle>
              <CardDescription>
                Conta que receberá os benefícios da assinatura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt={partner?.name} />
                  <AvatarFallback>
                    {partner?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {partner?.establishments?.[0]?.name || partner?.name}
                  </h3>
                  {partner?.establishments?.[0]?.name && (
                    <p className="text-sm text-muted-foreground">
                      Responsável: {partner.name}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{partner?.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
