import { useMemo } from "react"
import { PieChartCard } from "./pie-chart-card"
import { useTopPaymentMethods } from "@/hooks/data/reports/use-top-payment-methods"

type TopPaymentMethodsChartProps = {
  startDate: string
  endDate: string
}

const paymentMethodTranslations: Record<string, string> = {
  cash: "Dinheiro",
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
  pix: "PIX",
  bank_transfer: "Transferência Bancária",
  check: "Cheque",
  voucher: "Voucher",
  other: "Outro",
}

export function TopPaymentMethodsChart({
  startDate,
  endDate,
}: TopPaymentMethodsChartProps) {
  const { data, isLoading } = useTopPaymentMethods({ startDate, endDate })

  const chartData = useMemo(() => {
    if (!data?.items) return []

    return data.items.map(item => ({
      value: item.usage,
      label: paymentMethodTranslations[item.method] || item.method,
      color: "",
    }))
  }, [data])

  return (
    <PieChartCard
      title="Formas de Pagamento"
      data={chartData}
      isLoading={isLoading}
      formatValue={value => value.toString()}
    />
  )
}
