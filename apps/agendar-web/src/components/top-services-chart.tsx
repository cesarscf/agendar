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
import { useTopServices } from "@/hooks/use-top-services";
import type { GetTopServicesParams } from "@/http/reports/get-top-services";
import { formatPriceFromCents } from "@/lib/utils";

interface TopServicesChartProps {
  params: GetTopServicesParams;
}

export function TopServicesChart({ params }: TopServicesChartProps) {
  const { data, isLoading, isError } = useTopServices(params);

  const { chartData, chartConfig } = React.useMemo(() => {
    if (!data?.items) {
      return {
        chartData: [],
        chartConfig: {} satisfies ChartConfig,
      };
    }

    const config: ChartConfig = {};

    const chartData = data.items.map((item, index) => {
      const serviceName = item.service.toLowerCase().replace(/\s+/g, "_");
      config[serviceName] = {
        label: item.service,
        color: `var(--chart-${(index % 7) + 1})`,
      };

      return {
        service: serviceName,
        revenue: Number(item.totalRevenueInCents),
        fill: `var(--color-${serviceName})`,
      };
    });

    return { chartData, chartConfig: config };
  }, [data]);

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Serviços mais rentáveis</CardTitle>
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
          <CardTitle>Serviços mais rentáveis.</CardTitle>
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
        <CardTitle>Serviços mais rentáveis</CardTitle>
        <CardDescription>
          Distribuição dos Serviços mais rentáveis.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => {
                    const serviceName =
                      chartConfig[item.payload.service]?.label || name;
                    return (
                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                            style={{ backgroundColor: item.payload.fill }}
                          />
                          <span className="text-muted-foreground">
                            {serviceName}
                          </span>
                        </div>
                        <span className="text-foreground font-mono font-medium tabular-nums ml-2">
                          {formatPriceFromCents(String(value))}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie data={chartData} dataKey="revenue" nameKey="service" />
            <ChartLegend
              content={<ChartLegendContent nameKey="service" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
