import { View, Text, TouchableOpacity } from "react-native"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, Briefcase, User, Users, Package } from "lucide-react-native"
import { Badge } from "./badge"
import type { Appointment } from "@/hooks/data/appointment/use-appointments"

interface AppointmentCardProps {
  appointment: Appointment
  onCheckIn?: (appointmentId: string) => void
  onCancel?: (appointmentId: string) => void
}

const statusLabels: Record<Appointment["status"], string> = {
  scheduled: "Agendado",
  completed: "Concluído",
  canceled: "Cancelado",
}

export function AppointmentCard({
  appointment,
  onCheckIn,
  onCancel,
}: AppointmentCardProps) {
  const formattedDate = format(appointment.startTime, "dd 'de' MMMM", {
    locale: ptBR,
  })
  const formattedTime = format(appointment.startTime, "HH:mm", {
    locale: ptBR,
  })

  const showCheckInButton = appointment.status === "scheduled"

  return (
    <View className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <View className="mb-3 flex-row flex-wrap gap-2">
        <Badge variant={appointment.status as Appointment["status"]}>
          {statusLabels[appointment.status]}
        </Badge>
        {appointment.package && (
          <View
            className={`flex-row items-center px-3 py-1 rounded-full ${
              appointment.package.paid ? "bg-green-100" : "bg-amber-100"
            }`}
          >
            <Package
              size={12}
              color={appointment.package.paid ? "#15803d" : "#b45309"}
            />
            <Text
              className={`ml-1 text-xs font-semibold ${
                appointment.package.paid ? "text-green-800" : "text-amber-800"
              }`}
            >
              {appointment.package.name} (
              {appointment.package.remainingSessions}/
              {appointment.package.totalSessions})
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center mb-2">
        <Clock size={16} color="#6B7280" />
        <Text className="ml-2 text-gray-700 font-medium">
          {formattedDate} às {formattedTime}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Briefcase size={16} color="#6B7280" />
        <Text className="ml-2 text-gray-700">{appointment.service.name}</Text>
      </View>

      <View className="flex-row items-center mb-2">
        <User size={16} color="#6B7280" />
        <Text className="ml-2 text-gray-700">
          {appointment.professional.name}
        </Text>
      </View>

      <View className="flex-row items-center mb-3">
        <Users size={16} color="#6B7280" />
        <Text className="ml-2 text-gray-700 font-semibold">
          {appointment.customer.name}
        </Text>
      </View>

      {showCheckInButton && (
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onCheckIn?.(appointment.id)}
            className="flex-1 bg-blue-600 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Fazer Check-in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onCancel?.(appointment.id)}
            className="flex-1 bg-red-600 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
