import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CreditCard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";

export function PlanExpiredWarning() {
  const navigate = useNavigate();
  const { currentSubscription, isTrial } = useSubscription();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">
            {isTrial ? "Período Gratuito Encerrado" : "Plano Expirado"}
          </CardTitle>
          <CardDescription>
            {isTrial
              ? "Seu período de teste gratuito chegou ao fim"
              : "Sua assinatura expirou e você não tem mais acesso ao sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <CreditCard className="h-4 w-4" />
            <AlertTitle>
              {isTrial ? "Assine Agora" : "Renovação Necessária"}
            </AlertTitle>
            <AlertDescription>
              {isTrial
                ? "Gostou do sistema? Assine um de nossos planos para continuar aproveitando todos os recursos e gerenciar seus agendamentos sem interrupções."
                : "Para continuar usando o sistema, você precisa renovar sua assinatura. Escolha um plano que melhor se adequa às suas necessidades."}
            </AlertDescription>
          </Alert>

          {currentSubscription && !isTrial && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="mb-2 font-semibold">Último Plano Ativo:</h3>
              <p className="text-sm text-muted-foreground">
                {currentSubscription.plan.name} - R${" "}
                {currentSubscription.plan.price}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Status: {currentSubscription.status}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                navigate({ to: "/", hash: "#plans" });
              }}
            >
              {isTrial ? "Conhecer Planos" : "Ver Planos Disponíveis"}
            </Button>

            {currentSubscription && !isTrial && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigate({
                    to: "/checkout",
                    search: { planId: currentSubscription.plan.id },
                  });
                }}
              >
                Renovar Plano Anterior
              </Button>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Precisa de ajuda? Entre em contato com nosso suporte.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
