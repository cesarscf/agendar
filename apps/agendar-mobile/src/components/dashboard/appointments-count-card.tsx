import { Calendar } from "lucide-react-native"
import { MetricCard } from "./metric-card"
import { useAppointmentsMetrics } from "@/hooks/data/reports/use-appointments-metrics"
import { formatNumber } from "@/utils"

type AppointmentsCountCardProps = {
  startDate: string
  endDate: string
}

export function AppointmentsCountCard({
  startDate,
  endDate,
}: AppointmentsCountCardProps) {
  const { data, isLoading, isError, refetch } = useAppointmentsMetrics({
    startDate,
    endDate,
  })

  return (
    <MetricCard
      title="Agendamentos"
      value={formatNumber(data?.appointmentsCount ?? 0)}
      subtitle={`${formatNumber(data?.value ?? 0)} clientes únicos`}
      icon={Calendar}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  )
}
