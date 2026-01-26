import * as React from "react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMostBookedServices } from "@/hooks/use-most-booked-services"
import type { GetMostBookedServicesParams } from "@/http/reports/get-most-booked-services"

interface MostBookedServicesChartProps {
  params: GetMostBookedServicesParams
}

export function MostBookedServicesChart({
  params,
}: MostBookedServicesChartProps) {
  const { data, isLoading, isError } = useMostBookedServices(params)

  const { chartData, chartConfig } = React.useMemo(() => {
    if (!data?.items) {
      return {
        chartData: [],
        chartConfig: {
          totalBookings: { label: "Agendamentos" },
        } satisfies ChartConfig,
      }
    }

    const config: ChartConfig = {
      totalBookings: { label: "Agendamentos" },
    }

    const chartData = data.items.map((item, index) => {
      const serviceName = item.service.toLowerCase().replace(/\s+/g, "_")
      config[serviceName] = {
        label: item.service,
        color: `var(--chart-${(index % 7) + 1})`,
      }

      return {
        service: serviceName,
        totalBookings: item.totalBookings,
        fill: `var(--color-${serviceName})`,
      }
    })

    return { chartData, chartConfig: config }
  }, [data])

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Serviços Mais Agendados</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Carregando gráfico...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError || !chartData.length) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Serviços Mais Agendados</CardTitle>
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
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Serviços Mais Agendados</CardTitle>
        <CardDescription>
          Distribuição dos serviços mais procurados
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
              content={<ChartTooltipContent hideLabel nameKey="service" />}
            />
            <Pie data={chartData} dataKey="totalBookings" />
            <ChartLegend
              content={<ChartLegendContent nameKey="service" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
