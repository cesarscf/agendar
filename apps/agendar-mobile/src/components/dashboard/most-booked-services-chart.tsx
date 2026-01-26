import { useMemo } from "react"
import { PieChartCard } from "./pie-chart-card"
import { useMostBookedServices } from "@/hooks/data/reports/use-most-booked-services"
import { formatNumber } from "@/utils"

type MostBookedServicesChartProps = {
  startDate: string
  endDate: string
}

export function MostBookedServicesChart({
  startDate,
  endDate,
}: MostBookedServicesChartProps) {
  const { data, isLoading } = useMostBookedServices({ startDate, endDate })

  const chartData = useMemo(() => {
    if (!data?.items) return []

    return data.items.map(item => ({
      value: item.totalBookings,
      label: item.service,
      color: "",
    }))
  }, [data])

  return (
    <PieChartCard
      title="Serviços Mais Agendados"
      data={chartData}
      isLoading={isLoading}
      formatValue={formatNumber}
    />
  )
}
