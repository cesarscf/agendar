import { Receipt } from "lucide-react-native"
import { MetricCard } from "./metric-card"
import { useAverageTicket } from "@/hooks/data/reports/use-average-ticket"
import { formatPriceFromCents } from "@/utils"

type AverageTicketCardProps = {
  startDate: string
  endDate: string
}

export function AverageTicketCard({
  startDate,
  endDate,
}: AverageTicketCardProps) {
  const { data, isLoading, isError, refetch } = useAverageTicket({
    startDate,
    endDate,
  })

  return (
    <MetricCard
      title="Ticket Médio"
      value={formatPriceFromCents(data?.value ?? 0)}
      icon={Receipt}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  )
}
