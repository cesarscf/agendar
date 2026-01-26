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
import { useEmployeeRevenue } from "@/hooks/use-employee-revenue";
import type { GetEmployeeCommissionParams } from "@/http/reports/get-employee-revenue";
import { abbreviateName, formatPriceFromCents } from "@/lib/utils";

interface EmployeeRevenueChartProps {
  params: GetEmployeeCommissionParams;
}

export function EmployeeRevenueChart({ params }: EmployeeRevenueChartProps) {
  const { data, isLoading, isError } = useEmployeeRevenue(params);

  const { chartData, chartConfig } = React.useMemo(() => {
    if (!data?.items) {
      return {
        chartData: [],
        chartConfig: { revenue: { label: "Receita" } } satisfies ChartConfig,
      };
    }

    const config: ChartConfig = {
      revenue: { label: "Receita" },
    };

    const chartData = data.items.map((item, index) => {
      const employeeName = item.employee.toLowerCase().replace(/\s+/g, "_");
      config[employeeName] = {
        label: abbreviateName(item.employee),
        color: `var(--chart-${(index % 7) + 1})`,
      };

      return {
        employee: employeeName,
        employeeName: abbreviateName(item.employee),
        revenue: Number(item.revenueInCents),
        fill: `var(--chart-${(index % 7) + 1})`,
      };
    });

    return { chartData, chartConfig: config };
  }, [data]);

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Receita por Funcionário</CardTitle>
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
          <CardTitle>Receita por Funcionário</CardTitle>
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
        <CardTitle>Receita por Funcionário</CardTitle>
        <CardDescription>
          Distribuição da receita total gerada por funcionário
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[300px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="employeeName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => formatPriceFromCents(String(value))}
                />
              }
            />
            <Bar dataKey="revenue" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
