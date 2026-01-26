import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native"
import { X } from "lucide-react-native"
import { useState } from "react"

import { AppButton } from "./button"
import type { Appointment } from "@/hooks/data/appointment/use-appointments"

interface CancelAppointmentDialogProps {
  visible: boolean
  appointment: Appointment | null
  onClose: () => void
  onConfirm: (appointmentId: string, reason: string) => void
  isLoading?: boolean
}

export function CancelAppointmentDialog({
  visible,
  appointment,
  onClose,
  onConfirm,
  isLoading,
}: CancelAppointmentDialogProps) {
  const [reason, setReason] = useState("")

  const handleConfirm = () => {
    if (!reason.trim()) {
      Alert.alert("Atenção", "Por favor, informe o motivo do cancelamento.")
      return
    }

    if (!appointment?.id) return

    onConfirm(appointment.id, reason.trim())
  }

  const handleClose = () => {
    setReason("")
    onClose()
  }

  if (!appointment) return null

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
      transparent
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-lg w-full max-w-md">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-semibold text-red-600">
              Cancelar Agendamento
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              className="p-2"
              disabled={isLoading}
            >
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="p-4 gap-4">
            {/* Appointment Info */}
            <View className="bg-gray-50 p-4 rounded-lg gap-2">
              <Text className="text-base font-semibold">
                {appointment.customer.name}
              </Text>
              <Text className="text-gray-600">{appointment.service.name}</Text>
              <Text className="text-gray-600">
                Profissional: {appointment.professional.name}
              </Text>
            </View>

            {/* Reason Input */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">
                Motivo do cancelamento *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base min-h-24"
                placeholder="Informe o motivo do cancelamento..."
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!isLoading}
              />
            </View>

            {/* Warning */}
            <View className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <Text className="text-red-800 text-sm">
                Esta ação não pode ser desfeita. O agendamento será cancelado
                permanentemente.
              </Text>
            </View>

            {/* Actions */}
            <View className="gap-3 mt-2">
              <AppButton
                title="Confirmar Cancelamento"
                onPress={handleConfirm}
                loading={isLoading}
                disabled={isLoading || !reason.trim()}
                theme="danger"
              />
              <AppButton
                title="Voltar"
                onPress={handleClose}
                disabled={isLoading}
                theme="secondary"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
