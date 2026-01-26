import { useMemo } from "react"
import { PieChartCard } from "./pie-chart-card"
import { useTopServices } from "@/hooks/data/reports/use-top-services"
import { formatPriceFromCents } from "@/utils"

type TopServicesChartProps = {
  startDate: string
  endDate: string
}

export function TopServicesChart({
  startDate,
  endDate,
}: TopServicesChartProps) {
  const { data, isLoading } = useTopServices({ startDate, endDate })

  const chartData = useMemo(() => {
    if (!data?.items) return []

    return data.items.map(item => ({
      value: item.totalRevenueInCents / 100,
      label: item.service,
      color: "",
    }))
  }, [data])

  return (
    <PieChartCard
      title="Serviços mais rentáveis"
      data={chartData}
      isLoading={isLoading}
      formatValue={value => formatPriceFromCents(value * 100)}
    />
  )
}
