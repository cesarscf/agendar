import { useQuery } from "@tanstack/react-query"
import { endOfMonth, format, startOfMonth } from "date-fns"
import { useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native"
import { getMyAppointments } from "@/http/employee-self/get-my-appointments"
import { getMyEarnings } from "@/http/employee-self/get-my-earnings"
import { formatPriceFromCents } from "@/utils"

const statusLabels: Record<string, string> = {
  scheduled: "Agendado",
  completed: "Concluído",
  canceled: "Cancelado",
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
}

export default function MyDashboard() {
  const [startDate] = useState(
    () => startOfMonth(new Date())
  )
  const [endDate] = useState(() => endOfMonth(new Date()))

  const formattedStart = format(startDate, "yyyy-MM-dd")
  const formattedEnd = format(endDate, "yyyy-MM-dd")

  const { data: earnings, isLoading: earningsLoading } =
    useQuery({
      queryKey: [
        "my-earnings",
        formattedStart,
        formattedEnd,
      ],
      queryFn: async () => {
        const result = await getMyEarnings({
          startDate: formattedStart,
          endDate: formattedEnd,
        })
        return result.data
      },
    })

  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
  } = useQuery({
    queryKey: [
      "my-appointments",
      formattedStart,
      formattedEnd,
    ],
    queryFn: async () => {
      const result = await getMyAppointments({
        startDate: formattedStart,
        endDate: formattedEnd,
        perPage: 100,
      })
      return result.data
    },
  })

  if (earningsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 gap-4">
        <Text className="text-lg font-bold text-gray-900">
          Meus Relatórios
        </Text>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-gray-50 rounded-xl p-4">
            <Text className="text-xs text-gray-500 mb-1">
              Atendimentos
            </Text>
            <Text className="text-xl font-bold text-gray-900">
              {earnings?.completedAppointments ?? 0}
            </Text>
          </View>
          <View className="flex-1 bg-gray-50 rounded-xl p-4">
            <Text className="text-xs text-gray-500 mb-1">
              Faturamento
            </Text>
            <Text className="text-xl font-bold text-gray-900">
              {formatPriceFromCents(
                earnings?.revenueInCents ?? 0
              )}
            </Text>
          </View>
          <View className="flex-1 bg-gray-50 rounded-xl p-4">
            <Text className="text-xs text-gray-500 mb-1">
              Comissão
            </Text>
            <Text className="text-xl font-bold text-gray-900">
              {formatPriceFromCents(
                earnings?.commissionInCents ?? 0
              )}
            </Text>
          </View>
        </View>

        <Text className="text-base font-semibold text-gray-900 mt-2">
          Meus Agendamentos
        </Text>

        {appointmentsLoading ? (
          <ActivityIndicator
            size="small"
            color="#000"
            className="py-8"
          />
        ) : !appointmentsData?.appointments.length ? (
          <Text className="text-center text-gray-500 py-8">
            Nenhum agendamento no período.
          </Text>
        ) : (
          <View className="gap-2">
            {appointmentsData.appointments.map(apt => (
              <View
                key={apt.id}
                className="bg-gray-50 rounded-xl p-4"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-semibold text-gray-900">
                    {apt.customer.name}
                  </Text>
                  <View
                    className={`px-2 py-0.5 rounded-full ${statusColors[apt.status] ?? "bg-gray-100"}`}
                  >
                    <Text className="text-xs font-medium">
                      {statusLabels[apt.status] ??
                        apt.status}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm text-gray-600">
                  {apt.service.name}
                </Text>
                <Text className="text-xs text-gray-400 mt-1">
                  {format(
                    new Date(apt.startTime),
                    "dd/MM/yyyy HH:mm"
                  )}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}
