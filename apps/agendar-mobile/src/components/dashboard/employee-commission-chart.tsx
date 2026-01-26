import { useMemo } from "react"
import { HorizontalBarChart } from "./horizontal-bar-chart"
import { useEmployeeCommission } from "@/hooks/data/reports/use-employee-commission"
import { formatPriceFromCents } from "@/utils"

type EmployeeCommissionChartProps = {
  startDate: string
  endDate: string
}

export function EmployeeCommissionChart({
  startDate,
  endDate,
}: EmployeeCommissionChartProps) {
  const { data, isLoading } = useEmployeeCommission({ startDate, endDate })

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
      title="Comissão por Profissional"
      data={chartData}
      isLoading={isLoading}
    />
  )
}
