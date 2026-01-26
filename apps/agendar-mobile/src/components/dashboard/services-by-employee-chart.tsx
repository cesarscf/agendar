import { useMemo } from "react"
import { PieChartCard } from "./pie-chart-card"
import { useServicesByEmployee } from "@/hooks/data/reports/use-services-by-employee"
import { formatNumber } from "@/utils"

type ServicesByEmployeeChartProps = {
  startDate: string
  endDate: string
}

export function ServicesByEmployeeChart({
  startDate,
  endDate,
}: ServicesByEmployeeChartProps) {
  const { data, isLoading } = useServicesByEmployee({ startDate, endDate })

  const chartData = useMemo(() => {
    if (!data?.items) return []

    return data.items.map(item => ({
      value: item.totalBookings,
      label: item.employee,
      color: "",
    }))
  }, [data])

  return (
    <PieChartCard
      title="Serviços por Profissional"
      data={chartData}
      isLoading={isLoading}
      formatValue={formatNumber}
    />
  )
}
