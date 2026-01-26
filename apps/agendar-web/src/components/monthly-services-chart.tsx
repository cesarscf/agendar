import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMonthlyServices } from "@/hooks/use-monthly-services"
import { useServices } from "@/hooks/use-services"

const monthNames: Record<string, string> = {
  January: "Janeiro",
  February: "Fevereiro",
  March: "Março",
  April: "Abril",
  May: "Maio",
  June: "Junho",
  July: "Julho",
  August: "Agosto",
  September: "Setembro",
  October: "Outubro",
  November: "Novembro",
  December: "Dezembro",
}

const chartConfig = {
  value: {
    label: "Serviços",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function MonthlyServicesChart() {
  const [selectedService, setSelectedService] = React.useState<string>("all")
  const { data: servicesData, isLoading: isLoadingServices } = useServices()
  const { data, isLoading, isError } = useMonthlyServices({
    serviceId: selectedService === "all" ? undefined : selectedService,
  })

  console.log(data)

  const chartData = React.useMemo(() => {
    const allMonths = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]

    const dataMap = new Map(
      data?.items?.map(item => [
        monthNames[item.month] || item.month,
        item.value,
      ]) || []
    )

    return allMonths.map(month => ({
      month,
      value: dataMap.get(month) || 0,
    }))
  }, [data])

  if (isLoading || isLoadingServices) {
    return (
      <Card className="max-w-[600px]">
        <CardHeader>
          <CardTitle>Serviços Mensais</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center ">
            <p className="text-muted-foreground">Carregando gráfico...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="max-w-[600px]">
        <CardHeader>
          <CardTitle>Serviços Mensais</CardTitle>
          <CardDescription>Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center ">
            <p className="text-muted-foreground">
              Não foi possível carregar o gráfico
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Serviços Mensais</CardTitle>
            <CardDescription>
              {selectedService === "all"
                ? "Visualização de todos os serviços por mês"
                : "Serviços filtrados por tipo"}
            </CardDescription>
          </div>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione um serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os serviços</SelectItem>
              {servicesData?.map(service => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
