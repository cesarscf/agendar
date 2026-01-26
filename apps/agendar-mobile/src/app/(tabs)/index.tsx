import { useAppointments } from "@/hooks/data/appointment/use-appointments"
import type { Appointment } from "@/hooks/data/appointment/use-appointments"
import { useEmployees } from "@/hooks/data/employees/use-employees"
import { useServices } from "@/hooks/data/services/use-services"
import { useEstablishment } from "@/hooks/data/establishment/use-establishment"
import { useCancelAppointment } from "@/hooks/data/appointment/use-cancel-appointment"
import { AppointmentCard } from "@/components/appointment-card"
import { CheckinDialog } from "@/components/checkin-dialog"
import { CancelAppointmentDialog } from "@/components/cancel-appointment-dialog"
import { Empty } from "@/components/empty"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { useAgendaFilters } from "@/hooks/use-agenda-filters"

import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  Pressable,
  Linking,
} from "react-native"
import { ChevronDown, ChevronUp, CalendarX } from "lucide-react-native"
import { useState } from "react"

export default function Appointments() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<
    "scheduled" | "completed" | "canceled" | ""
  >("scheduled")
  const [showFilters, setShowFilters] = useState(false)
  const [checkinDialogVisible, setCheckinDialogVisible] = useState(false)
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clearFilters,
    isLoading: isLoadingFilters,
  } = useAgendaFilters()

  const { mutate: cancelAppointment, isPending: isCancelling } =
    useCancelAppointment()

  const handleCheckIn = (appointmentId: string) => {
    const appointment = data?.appointments.find(a => a.id === appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      setCheckinDialogVisible(true)
    }
  }

  const handleCancel = (appointmentId: string) => {
    const appointment = data?.appointments.find(a => a.id === appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      setCancelDialogVisible(true)
    }
  }

  const handleConfirmCancel = (appointmentId: string, reason: string) => {
    cancelAppointment(
      { appointmentId, reason },
      {
        onSuccess: () => {
          setCancelDialogVisible(false)
          setSelectedAppointment(null)
        },
      }
    )
  }

  const handleCloseCancelDialog = () => {
    setCancelDialogVisible(false)
    setSelectedAppointment(null)
  }

  const handleCloseCheckinDialog = () => {
    setCheckinDialogVisible(false)
    setSelectedAppointment(null)
  }

  const { data: employees } = useEmployees()
  const { data: services } = useServices()
  const { data: establishment } = useEstablishment()

  const { data, isLoading, error, refetch, isRefetching } = useAppointments({
    startDate,
    endDate,
    status: selectedStatus || undefined,
    employeeId: selectedEmployee || undefined,
    serviceId: selectedService || undefined,
  })

  if (isLoadingFilters) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        <View className="flex-row items-center justify-between mb-6">
          <Pressable
            onPress={() => {
              const url = `https://agendar-web-omega.vercel.app/${establishment?.slug}`
              Linking.openURL(url)
            }}
            className="flex-row items-center flex-1"
          >
            {establishment?.logoUrl ? (
              <Image
                source={{ uri: establishment.logoUrl }}
                className="w-12 h-12 rounded-full mr-3"
                resizeMode="cover"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-gray-200 mr-3 items-center justify-center">
                <Text className="text-gray-500 text-lg font-bold">
                  {establishment?.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <Text className="text-xl font-bold text-gray-800 flex-1">
              {establishment?.name || "Carregando..."}
            </Text>
          </Pressable>
          <Image
            source={require("../../../assets/agendar-logo.png")}
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>

        <DashboardFilters
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClearFilters={clearFilters}
          onRefresh={() => refetch()}
          isRefreshing={isRefetching}
        />

        <View className="mb-4 mt-4">
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="flex-row items-center justify-between bg-gray-100 p-3 rounded-lg"
          >
            <Text className="font-semibold text-gray-700">Filtros</Text>
            {showFilters ? (
              <ChevronUp size={20} color="#374151" />
            ) : (
              <ChevronDown size={20} color="#374151" />
            )}
          </TouchableOpacity>

          {showFilters && (
            <View className="mt-3 gap-4">
              {/* Filtro de Status */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Status
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  <TouchableOpacity
                    onPress={() => setSelectedStatus("")}
                    className={`px-4 py-2 rounded-full ${
                      selectedStatus === "" ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        selectedStatus === "" ? "text-white" : "text-gray-700"
                      }
                    >
                      Todos
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedStatus("scheduled")}
                    className={`px-4 py-2 rounded-full ${
                      selectedStatus === "scheduled"
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        selectedStatus === "scheduled"
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      Agendado
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedStatus("completed")}
                    className={`px-4 py-2 rounded-full ${
                      selectedStatus === "completed"
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        selectedStatus === "completed"
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      Concluído
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedStatus("canceled")}
                    className={`px-4 py-2 rounded-full ${
                      selectedStatus === "canceled"
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        selectedStatus === "canceled"
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      Cancelado
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Filtro de Profissional */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Profissional
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row gap-2"
                >
                  <TouchableOpacity
                    onPress={() => setSelectedEmployee("")}
                    className={`px-4 py-2 rounded-full ${
                      selectedEmployee === "" ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        selectedEmployee === "" ? "text-white" : "text-gray-700"
                      }
                    >
                      Todos
                    </Text>
                  </TouchableOpacity>
                  {employees?.map(employee => (
                    <TouchableOpacity
                      key={employee.id}
                      onPress={() => setSelectedEmployee(employee.id)}
                      className={`px-4 py-2 rounded-full ${
                        selectedEmployee === employee.id
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <Text
                        className={
                          selectedEmployee === employee.id
                            ? "text-white"
                            : "text-gray-700"
                        }
                      >
                        {employee.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Serviço
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row gap-2"
                >
                  <TouchableOpacity
                    onPress={() => setSelectedService("")}
                    className={`px-4 py-2 rounded-full ${
                      selectedService === "" ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        selectedService === "" ? "text-white" : "text-gray-700"
                      }
                    >
                      Todos
                    </Text>
                  </TouchableOpacity>
                  {services?.map(service => (
                    <TouchableOpacity
                      key={service.id}
                      onPress={() => setSelectedService(service.id)}
                      className={`px-4 py-2 rounded-full ${
                        selectedService === service.id
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <Text
                        className={
                          selectedService === service.id
                            ? "text-white"
                            : "text-gray-700"
                        }
                      >
                        {service.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text className="text-red-500">{error.message}</Text>
        ) : (
          <FlatList
            data={data?.appointments || []}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <Empty
                message="Nenhum agendamento encontrado"
                icon={<CalendarX size={48} color="#9CA3AF" />}
              />
            }
            renderItem={({ item }) => (
              <AppointmentCard
                appointment={item}
                onCheckIn={handleCheckIn}
                onCancel={handleCancel}
              />
            )}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      <CheckinDialog
        visible={checkinDialogVisible}
        appointment={selectedAppointment}
        onClose={handleCloseCheckinDialog}
        onSuccess={() => {
          // Dialog already closes on success, just need to trigger any additional logic if needed
        }}
      />

      <CancelAppointmentDialog
        visible={cancelDialogVisible}
        appointment={selectedAppointment}
        onClose={handleCloseCancelDialog}
        onConfirm={handleConfirmCancel}
        isLoading={isCancelling}
      />
    </SafeAreaView>
  )
}
