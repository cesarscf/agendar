import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { endOfMonth, format, startOfMonth } from "date-fns"
import { CalendarDays, DollarSign, TrendingUp } from "lucide-react"
import { parseAsIsoDate, useQueryState } from "nuqs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMyAppointments } from "@/http/employee-self/get-my-appointments"
import { getMyEarnings } from "@/http/employee-self/get-my-earnings"
import { formatPriceFromCents } from "@/lib/utils"

export const Route = createFileRoute("/app/my-dashboard/")({
  component: MyDashboard,
})

const getCurrentMonthStart = () => startOfMonth(new Date())
const getCurrentMonthEnd = () => endOfMonth(new Date())

function MyDashboard() {
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsIsoDate.withDefault(getCurrentMonthStart())
  )
  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsIsoDate.withDefault(getCurrentMonthEnd())
  )

  const formattedStart = format(startDate, "yyyy-MM-dd")
  const formattedEnd = format(endDate, "yyyy-MM-dd")

  const { data: earnings, isLoading: earningsLoading } =
    useQuery({
      queryKey: [
        "my-earnings",
        formattedStart,
        formattedEnd,
      ],
      queryFn: () =>
        getMyEarnings({
          startDate: formattedStart,
          endDate: formattedEnd,
        }),
    })

  const { data: appointmentsData, isLoading: appointmentsLoading } =
    useQuery({
      queryKey: [
        "my-appointments",
        formattedStart,
        formattedEnd,
      ],
      queryFn: () =>
        getMyAppointments({
          startDate: formattedStart,
          endDate: formattedEnd,
          perPage: 100,
        }),
    })

  const isLoading = earningsLoading || appointmentsLoading

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Meus Relatórios
        </h1>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={formattedStart}
            onChange={e =>
              setStartDate(new Date(e.target.value))
            }
            className="rounded-md border px-3 py-1.5 text-sm"
          />
          <span className="text-muted-foreground">até</span>
          <input
            type="date"
            value={formattedEnd}
            onChange={e =>
              setEndDate(new Date(e.target.value))
            }
            className="rounded-md border px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atendimentos concluídos
            </CardTitle>
            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : (earnings?.completedAppointments ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : formatPriceFromCents(
                    String(earnings?.revenueInCents ?? 0)
                  )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comissão
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : formatPriceFromCents(
                    String(
                      earnings?.commissionInCents ?? 0
                    )
                  )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {appointmentsLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : !appointmentsData?.appointments.length ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum agendamento no período selecionado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-medium">
                      Data/Hora
                    </th>
                    <th className="p-2 font-medium">
                      Cliente
                    </th>
                    <th className="p-2 font-medium">
                      Serviço
                    </th>
                    <th className="p-2 font-medium">
                      Status
                    </th>
                    <th className="p-2 font-medium">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsData.appointments.map(
                    apt => (
                      <tr
                        key={apt.id}
                        className="border-b"
                      >
                        <td className="p-2">
                          {format(
                            new Date(apt.startTime),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </td>
                        <td className="p-2">
                          {apt.customer.name}
                        </td>
                        <td className="p-2">
                          {apt.service.name}
                        </td>
                        <td className="p-2">
                          <StatusBadge
                            status={apt.status}
                          />
                        </td>
                        <td className="p-2">
                          {formatPriceFromCents(
                            apt.service.servicePrice
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    scheduled: "Agendado",
    completed: "Concluído",
    canceled: "Cancelado",
  }
  const colors: Record<string, string> = {
    scheduled:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    canceled:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {labels[status] ?? status}
    </span>
  )
}
