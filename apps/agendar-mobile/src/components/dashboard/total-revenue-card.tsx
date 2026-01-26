import { DollarSign } from "lucide-react-native"
import { MetricCard } from "./metric-card"
import { useDailyRevenue } from "@/hooks/data/reports/use-daily-revenue"
import { formatPriceFromCents } from "@/utils"

type TotalRevenueCardProps = {
  startDate: string
  endDate: string
}

export function TotalRevenueCard({
  startDate,
  endDate,
}: TotalRevenueCardProps) {
  const { data, isLoading, isError, refetch } = useDailyRevenue({
    startDate,
    endDate,
  })

  const total = data?.items.reduce((sum, item) => sum + item.value, 0) ?? 0

  return (
    <MetricCard
      title="Receita Total"
      value={formatPriceFromCents(total)}
      icon={DollarSign}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  )
}
