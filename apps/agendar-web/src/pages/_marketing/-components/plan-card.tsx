import { Link } from "@tanstack/react-router";
import { Calendar, Check, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Plan } from "@/lib/validations/plan";

export function PlanCard({
  plan,
  currentPlanId,
}: {
  plan: Plan;
  currentPlanId?: string;
}) {
  const getDiscountBadge = (intervalMonth: number) => {
    if (intervalMonth === 6) return "10% OFF";
    if (intervalMonth === 12) return "20% OFF";
    return null;
  };

  const getProfessionalsText = (min: number, max: number) => {
    if (min === max) return `${min} profissional`;
    if (max === 100) return `${min}+ profissionais`;
    return `${min} a ${max} profissionais`;
  };

  return (
    <Card className="relative hover:shadow-lg transition-shadow duration-300">
      {getDiscountBadge(plan.intervalMonth) && (
        <Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600">
          {getDiscountBadge(plan.intervalMonth)}
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {plan.name}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">R$ {plan.price}</div>
          <div className="text-sm text-muted-foreground">
            por{" "}
            {plan.intervalMonth === 1
              ? "mês"
              : plan.intervalMonth === 6
                ? "semestre"
                : "ano"}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-500" />
            <span>
              {getProfessionalsText(
                plan.minimumProfessionalsIncluded,
                plan.maximumProfessionalsIncluded,
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>{plan.trialPeriodDays} dias de teste grátis</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Suporte completo</span>
          </div>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
          disabled={currentPlanId === plan.id}
        >
          <Link
            to="/checkout"
            search={{
              planId: plan.id,
            }}
          >
            {currentPlanId === plan.id ? "Plano Atual" : "Compre seu plano"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
