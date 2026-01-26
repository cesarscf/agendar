import { useMemo } from "react"
import { HorizontalBarChart } from "./horizontal-bar-chart"
import { useEmployeeRevenue } from "@/hooks/data/reports/use-employee-revenue"
import { formatPriceFromCents } from "@/utils"

type EmployeeRevenueChartProps = {
  startDate: string
  endDate: string
}

export function EmployeeRevenueChart({
  startDate,
  endDate,
}: EmployeeRevenueChartProps) {
  const { data, isLoading } = useEmployeeRevenue({ startDate, endDate })

  const chartData = useMemo(() => {
    if (!data?.items) return []

    return data.items.map(item => ({
      label: item.employee,
      value: item.revenueInCents / 100,
      formattedValue: formatPriceFromCents(item.revenueInCents),
    }))
  }, [data])

  return (
    <HorizontalBarChart
      title="Receita por Profissional"
      data={chartData}
      isLoading={isLoading}
    />
  )
}
