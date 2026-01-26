import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDailyRevenue } from "@/hooks/use-daily-revenue";
import type { GetDailyRevenueParams } from "@/http/reports/get-daily-revenue";
import { formatPrice } from "@/lib/utils";

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface DailyRevenueChartProps {
  params: GetDailyRevenueParams;
}

export function DailyRevenueChart({ params }: DailyRevenueChartProps) {
  const { data, isLoading, isError } = useDailyRevenue(params);

  const chartData = React.useMemo(() => {
    if (!data?.items) return [];
    return data.items.map((item) => ({
      date: item.date,
      value: item.value / 100,
    }));
  }, [data]);

  const total = React.useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
            <CardTitle>Receita Diária</CardTitle>
            <CardDescription>Carregando dados...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">Carregando gráfico...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !chartData.length) {
    return (
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
            <CardTitle>Receita Diária</CardTitle>
            <CardDescription>Erro ao carregar dados</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">
              Não foi possível carregar o gráfico
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-6">
          <CardTitle>Receita Diária</CardTitle>
          <CardDescription>
            Mostrando receita do período selecionado
          </CardDescription>
        </div>
        <div className="flex">
          <div className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">
              {chartConfig.revenue.label} Total
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  nameKey="revenue"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) => {
                    return formatPrice(value as number);
                  }}
                />
              }
            />
            <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
