import { TrendingUp } from "lucide-react-native"
import { useNetRevenue } from "@/hooks/data/reports/use-net-revenue"
import { formatPriceFromCents } from "@/utils"
import { MetricCard } from "./metric-card"

type NetRevenueCardProps = {
  startDate: string
  endDate: string
}

export function NetRevenueCard({ startDate, endDate }: NetRevenueCardProps) {
  const { data, isLoading, isError, refetch } = useNetRevenue({
    startDate,
    endDate,
  })

  return (
    <MetricCard
      title="Receita Líquida"
      value={formatPriceFromCents(data?.value ?? 0)}
      subtitle="Receita Total - Comissões"
      icon={TrendingUp}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  )
}
