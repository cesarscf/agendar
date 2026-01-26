import { useMemo } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDailyRevenue } from "@/hooks/use-daily-revenue";
import type { GetDailyRevenueParams } from "@/http/reports/get-daily-revenue";
import { formatPriceFromCents } from "@/lib/utils";

interface TotalRevenueCardProps {
  params: GetDailyRevenueParams;
}

export function TotalRevenueCard({ params }: TotalRevenueCardProps) {
  const { data, isLoading, isError } = useDailyRevenue(params);

  const totalInCents = useMemo(() => {
    if (!data?.items || data.items.length === 0) {
      return 0;
    }

    return data.items.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Receita Total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Carregando...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Receita Total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Erro
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Não foi possível carregar os dados
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Receita Total</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatPriceFromCents(String(totalInCents))}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          Receita para o período selecionado
        </div>
      </CardFooter>
    </Card>
  );
}
