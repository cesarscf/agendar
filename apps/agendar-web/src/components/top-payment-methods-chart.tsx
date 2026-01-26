import * as React from "react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTopPaymentMethods } from "@/hooks/use-top-payment-methods";
import type { GetTopPaymentMethodsParams } from "@/http/reports/get-top-payment-methods";

const chartConfig = {
  usage: {
    label: "Utilização",
  },
  pix: {
    label: "PIX",
    color: "var(--chart-1)",
  },
  credit_card: {
    label: "Cartão de Crédito",
    color: "var(--chart-2)",
  },
  debit_card: {
    label: "Cartão de Débito",
    color: "var(--chart-3)",
  },
  cash: {
    label: "Dinheiro",
    color: "var(--chart-4)",
  },
  package: {
    label: "Pacote",
    color: "var(--chart-5)",
  },
  loyalty: {
    label: "Fidelidade",
    color: "var(--chart-6)",
  },
  other: {
    label: "Outros",
    color: "var(--chart-7)",
  },
} satisfies ChartConfig;

interface TopPaymentMethodsChartProps {
  params: GetTopPaymentMethodsParams;
}

export function TopPaymentMethodsChart({
  params,
}: TopPaymentMethodsChartProps) {
  const { data, isLoading, isError } = useTopPaymentMethods(params);

  const chartData = React.useMemo(() => {
    if (!data?.items) return [];
    return data.items.map((item) => ({
      method: item.method,
      usage: item.usage,
      fill: `var(--color-${item.method})`,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Métodos de Pagamento</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Carregando gráfico...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !chartData.length) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Métodos de Pagamento</CardTitle>
          <CardDescription>Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">
              Não foi possível carregar o gráfico
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Métodos de Pagamento</CardTitle>
        <CardDescription>
          Distribuição dos métodos de pagamento mais utilizados
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="method" />}
            />
            <Pie data={chartData} dataKey="usage" />
            <ChartLegend
              content={<ChartLegendContent nameKey="method" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
