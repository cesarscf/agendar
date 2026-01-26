import { useEffect, useMemo } from "react"
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react-native"

import { Input } from "./input"
import { AppButton } from "./button"
import { Select, type SelectOption } from "./select"
import { checkinSchema, type CheckinFormData } from "@/lib/validations/checkin"
import { useCheckBonus } from "@/hooks/data/appointment/use-check-bonus"
import { useCreateCheckin } from "@/hooks/data/appointment/use-create-checkin"
import type { Appointment } from "@/hooks/data/appointment/use-appointments"
import { formatCentsToReal } from "@/utils/currency"

interface CheckinDialogProps {
  visible: boolean
  appointment: Appointment | null
  onClose: () => void
  onSuccess?: () => void
}

export function CheckinDialog({
  visible,
  appointment,
  onClose,
  onSuccess,
}: CheckinDialogProps) {
  // Check bonus only when we have appointment data
  const { data: bonusData } = useCheckBonus(
    {
      customerId: appointment?.customer.id || "",
      serviceId: appointment?.service.id || "",
    },
    !!appointment && visible
  )

  const { mutateAsync: createCheckin, isPending: isSubmitting } =
    useCreateCheckin()

  // Calculate states
  const isFirstPackageSession = useMemo(
    () => appointment?.package && !appointment.package.paid,
    [appointment]
  )

  const isPackageAlreadyPaid = useMemo(
    () => appointment?.package?.paid,
    [appointment]
  )

  const hasBonus = bonusData?.hasBonus || false

  // Get default values
  const getDefaultValues = (): CheckinFormData => {
    if (!appointment) {
      return {
        status: "completed",
        paymentType: "pix",
        paymentAmount: "0",
        notes: "",
      }
    }

    if (isPackageAlreadyPaid) {
      return {
        status: "completed",
        paymentType: "package",
        paymentAmount: "0",
        notes: `Pagamento via pacote "${appointment.package?.name}"`,
      }
    }

    return {
      status: "completed",
      paymentType: "pix",
      paymentAmount:
        isFirstPackageSession && appointment.package
          ? String(appointment.package.price)
          : String(appointment.service.servicePrice),
      notes:
        isFirstPackageSession && appointment.package
          ? `Pagamento do pacote "${appointment.package.name}" - Primeiro serviço`
          : "",
    }
  }

  const form = useForm<CheckinFormData>({
    resolver: zodResolver(checkinSchema),
    defaultValues: getDefaultValues(),
  })

  // Update form when data is loaded
  useEffect(() => {
    if (appointment && visible) {
      const defaults = getDefaultValues()
      form.reset(defaults)
    }
  }, [appointment, isPackageAlreadyPaid, visible])

  // Get payment type options
  const paymentTypeOptions = useMemo((): SelectOption[] => {
    const baseOptions: SelectOption[] = [
      { value: "pix", label: "Pix" },
      { value: "credit_card", label: "Cartão de Crédito" },
      { value: "debit_card", label: "Cartão de Débito" },
      { value: "cash", label: "Dinheiro" },
      { value: "other", label: "Outro" },
    ]

    // Add package option if conditions are met
    if (appointment?.package && !isFirstPackageSession) {
      baseOptions.push({ value: "package", label: "Pacote" })
    }

    // Add loyalty option if bonus available
    if (hasBonus) {
      baseOptions.push({ value: "loyalty", label: "Fidelidade" })
    }

    return baseOptions
  }, [appointment, isFirstPackageSession, hasBonus])

  // Handle payment type change
  const handlePaymentTypeChange = (value: CheckinFormData["paymentType"]) => {
    form.setValue("paymentType", value)

    if (value === "loyalty") {
      form.setValue("paymentAmount", "0")
      form.setValue(
        "notes",
        `Pagamento via fidelidade - ${bonusData?.currentPoints || 0} pontos disponíveis`
      )
    } else if (value !== "package") {
      const correctAmount =
        isFirstPackageSession && appointment?.package
          ? String(appointment.package.price)
          : String(appointment?.service.servicePrice || "0")
      form.setValue("paymentAmount", correctAmount)

      // Clear notes if not first package session
      if (!(isFirstPackageSession && appointment?.package)) {
        form.setValue("notes", "")
      }
    }
  }

  const onSubmit = async (data: CheckinFormData) => {
    if (!appointment?.id) return
    try {
      await createCheckin({
        ...data,
        appointmentId: appointment.id,
      })
      Alert.alert("Sucesso", "Check-in realizado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            onSuccess?.()
            onClose()
          },
        },
      ])
    } catch (error) {
      Alert.alert("Erro", String(error))
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  if (!appointment) return null

  const isSelectDisabled = isPackageAlreadyPaid
  const currentPaymentType = form.watch("paymentType")
  const shouldDisablePaymentAmount =
    isPackageAlreadyPaid || currentPaymentType === "loyalty"

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-xl font-semibold">Check-in</Text>
          <TouchableOpacity
            onPress={handleClose}
            className="p-2"
            disabled={isSubmitting}
          >
            <X size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Package Feedback */}
        {appointment.package && (
          <View
            className={`mx-4 mt-4 p-3 rounded-lg ${
              isPackageAlreadyPaid
                ? "bg-green-50 border border-green-200"
                : isFirstPackageSession
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-blue-50 border border-blue-200"
            }`}
          >
            {isPackageAlreadyPaid ? (
              <View>
                <Text className="text-green-800 font-semibold mb-1">
                  ✓ Pacote já pago
                </Text>
                <Text className="text-green-700 text-sm">
                  Esta sessão já está coberta pelo pacote "
                  {appointment.package.name}". Não é necessário pagamento
                  adicional.
                </Text>
              </View>
            ) : isFirstPackageSession ? (
              <View>
                <Text className="text-amber-800 font-semibold mb-1">
                  ⚠ Primeira sessão do pacote
                </Text>
                <Text className="text-amber-700 text-sm">
                  Esta é a primeira sessão do pacote "{appointment.package.name}
                  ". O valor total do pacote (R${" "}
                  {formatCentsToReal(Number(appointment.package.price))}) deve
                  ser pago agora.
                </Text>
              </View>
            ) : (
              <View>
                <Text className="text-blue-800 font-semibold mb-1">
                  📦 Sessão do pacote
                </Text>
                <Text className="text-blue-700 text-sm">
                  Pacote: {appointment.package.name} (
                  {appointment.package.remainingSessions}/
                  {appointment.package.totalSessions} sessões restantes)
                </Text>
              </View>
            )}
          </View>
        )}

        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Appointment Info */}
          <View className="bg-gray-50 p-4 rounded-lg gap-2">
            <Text className="text-lg font-semibold">
              {appointment.customer.name}
            </Text>
            <Text className="text-gray-600">{appointment.service.name}</Text>
            <Text className="text-gray-600">
              Profissional: {appointment.professional.name}
            </Text>
            {appointment.package && (
              <View className="mt-2 pt-2 border-t border-gray-200">
                <Text className="text-sm font-medium text-blue-600">
                  Pacote: {appointment.package.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  Sessões restantes: {appointment.package.remainingSessions}/
                  {appointment.package.totalSessions}
                </Text>
                <Text className="text-sm text-gray-500">
                  Status: {appointment.package.paid ? "Pago" : "Pendente"}
                </Text>
              </View>
            )}
          </View>

          {/* Payment Type Select */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Tipo de Pagamento
            </Text>
            <Controller
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => handlePaymentTypeChange(value as CheckinFormData["paymentType"])}
                  options={paymentTypeOptions}
                  placeholder="Selecione o tipo de pagamento"
                  disabled={isSelectDisabled}
                />
              )}
            />
            {form.formState.errors.paymentType && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.paymentType.message}
              </Text>
            )}
          </View>

          {/* Payment Amount */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Valor do Pagamento
            </Text>
            <Controller
              control={form.control}
              name="paymentAmount"
              render={({ field }) => (
                <Input
                  placeholder="0,00"
                  keyboardType="decimal-pad"
                  value={field.value.replace(".", ",")}
                  onChangeText={(text) => {
                    // Substitui vírgula por ponto para armazenar internamente
                    const normalizedValue = text.replace(",", ".")
                    field.onChange(normalizedValue)
                  }}
                  editable={!shouldDisablePaymentAmount}
                />
              )}
            />
            {form.formState.errors.paymentAmount && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.paymentAmount.message}
              </Text>
            )}
          </View>

          {/* Notes */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Observações (opcional)
            </Text>
            <Controller
              control={form.control}
              name="notes"
              render={({ field }) => (
                <Input
                  placeholder="Observações sobre o pagamento"
                  value={field.value}
                  onChangeText={field.onChange}
                  multiline
                  numberOfLines={3}
                  style={{ height: 80, textAlignVertical: "top" }}
                />
              )}
            />
            {form.formState.errors.notes && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.notes.message}
              </Text>
            )}
          </View>

          <View className="gap-3 mt-4">
            <AppButton
              title="Confirmar Check-in"
              onPress={form.handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
            <AppButton
              title="Cancelar"
              onPress={handleClose}
              disabled={isSubmitting}
              theme="secondary"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}
