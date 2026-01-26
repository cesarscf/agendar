import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAppointmentsCount } from "@/hooks/use-appointments-count"
import type { GetAppointmentsMetricsParams } from "@/http/reports/get-appointments-metrics"

interface AppointmentsCountCardProps {
  params: GetAppointmentsMetricsParams
}

export function AppointmentsCountCard({ params }: AppointmentsCountCardProps) {
  const { data, isLoading, isError } = useAppointmentsCount(params)

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Agendamentos Realizados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Carregando...
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Agendamentos Realizados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Erro
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Não foi possível carregar os dados
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Agendamentos Realizados</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {data.appointmentsCount}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          Total de agendamentos realizados no período
        </div>
      </CardFooter>
    </Card>
  )
}
