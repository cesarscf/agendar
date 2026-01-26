import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getPlans } from "@/http/payments/get-plans";
import { getSubscriptions } from "@/http/payments/get-subscriptions";
import { PlanCard } from "./plan-card";

export function Pricing() {
  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  const subscription = subscriptions?.[0];

  if (isLoading) {
    return (
      <section id="planos" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Carregando planos...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const plans = data || [];

  const monthlyPlans = plans.filter((plan) => plan.intervalMonth === 1);
  const semestralPlans = plans.filter((plan) => plan.intervalMonth === 6);
  const annualPlans = plans.filter((plan) => plan.intervalMonth === 12);

  return (
    <section id="planos" className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-foreground">Escolha o Plano </span>
            <span className="text-[#F4C430]">Ideal</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Planos flexíveis para equipes de todos os tamanhos. Comece com 7
            dias grátis, sem compromisso.
          </p>
        </div>

        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 h-auto p-1">
            <TabsTrigger
              value="monthly"
              className="text-xs sm:text-sm py-2 px-2 sm:px-4"
            >
              Mensal
            </TabsTrigger>
            <TabsTrigger
              value="semestral"
              className="text-xs sm:text-sm py-2 px-1 sm:px-4 relative"
            >
              <div className="flex flex-col items-center gap-0.5">
                <span>Semestral</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1 py-0 h-4 bg-green-100 text-green-700 hidden sm:inline-flex"
                >
                  -10%
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[8px] px-1 py-0 h-3 bg-green-100 text-green-700 sm:hidden"
                >
                  10%
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              className="text-xs sm:text-sm py-2 px-1 sm:px-4 relative"
            >
              <div className="flex flex-col items-center gap-0.5">
                <span>Anual</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1 py-0 h-4 bg-green-100 text-green-700 hidden sm:inline-flex"
                >
                  -20%
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[8px] px-1 py-0 h-3 bg-green-100 text-green-700 sm:hidden"
                >
                  20%
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {monthlyPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currentPlanId={subscription?.plan.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="semestral">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {semestralPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currentPlanId={subscription?.plan.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="annual">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {annualPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currentPlanId={subscription?.plan.id}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
