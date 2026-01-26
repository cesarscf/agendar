import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAverageTicket } from "@/hooks/use-average-ticket";
import type { GetAverageTicketParams } from "@/http/reports/get-average-ticket";
import { formatPriceFromCents } from "@/lib/utils";

interface AverageTicketCardProps {
  params: GetAverageTicketParams;
}

export function AverageTicketCard({ params }: AverageTicketCardProps) {
  const { data, isLoading, isError } = useAverageTicket(params);

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Ticket Médio</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Carregando...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Ticket Médio</CardDescription>
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
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Ticket Médio</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatPriceFromCents(String(data.value))}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          Valor médio por atendimento no período
        </div>
      </CardFooter>
    </Card>
  );
}
