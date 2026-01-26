import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNetRevenue } from "@/hooks/use-net-revenue"
import type { GetNetRevenueParams } from "@/http/reports/get-net-revenue"
import { formatPriceFromCents } from "@/lib/utils"

interface NetRevenueCardProps {
  params: GetNetRevenueParams
}

export function NetRevenueCard({ params }: NetRevenueCardProps) {
  const { data, isLoading, isError } = useNetRevenue(params)

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Receita Líquida</CardDescription>
          <p className="text-xs text-muted-foreground">
            Receita Total - Comissões
          </p>
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
          <CardDescription>Receita Líquida</CardDescription>
          <p className="text-xs text-muted-foreground">
            Receita Total - Comissões
          </p>
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
        <CardDescription>Receita Líquida</CardDescription>
        <p className="text-xs text-muted-foreground">
          Receita Total - Comissões
        </p>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatPriceFromCents(String(data.value))}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          Receita líquida do período selecionado
        </div>
      </CardFooter>
    </Card>
  )
}
