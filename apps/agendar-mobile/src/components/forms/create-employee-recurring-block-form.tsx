import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createRecurringBlockSchema,
  type CreateEmployeeRecurringBlockRequest,
} from "@/lib/validations/blocks"
import { useCreateEmployeeRecurringBlock } from "@/hooks/data/employees/use-create-employee-recurring-block"
import { weekdays } from "@/utils"
import { AppButton } from "../button"
import { Input } from "../input"
import { TimeInput } from "../time-input"
import { Select } from "../select"

interface CreateEmployeeRecurringBlockFormProps {
  employeeId: string
  onSuccess?: () => void
}

export function CreateEmployeeRecurringBlockForm({
  employeeId,
  onSuccess,
}: CreateEmployeeRecurringBlockFormProps) {
  const { mutateAsync, isPending } = useCreateEmployeeRecurringBlock()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEmployeeRecurringBlockRequest>({
    resolver: zodResolver(createRecurringBlockSchema),
    defaultValues: {
      weekday: undefined,
      startTime: "",
      endTime: "",
      reason: "",
    },
  })

  const onSubmit = async (data: CreateEmployeeRecurringBlockRequest) => {
    try {
      await mutateAsync({
        employeeId,
        ...data,
      })

      Alert.alert("Sucesso", "Bloqueio recorrente criado com sucesso!")
      reset()
      onSuccess?.()
    } catch (error) {
      Alert.alert("Erro", error as string)
    }
  }

  const weekdayOptions = weekdays.map((day, index) => ({
    value: String(index),
    label: day,
  }))

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        className="flex-1 bg-white p-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium mb-1">Dia da semana</Text>
            <Controller
              control={control}
              name="weekday"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value !== undefined ? String(value) : ""}
                  onValueChange={val => onChange(Number(val))}
                  options={weekdayOptions}
                  placeholder="Selecione o dia da semana"
                />
              )}
            />
            {errors.weekday && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.weekday.message}
              </Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="startTime"
              render={({ field: { onChange, value } }) => (
                <TimeInput
                  label="Hora de início"
                  value={value}
                  onChangeTime={onChange}
                  placeholder="00:00"
                />
              )}
            />
            {errors.startTime && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.startTime.message}
              </Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="endTime"
              render={({ field: { onChange, value } }) => (
                <TimeInput
                  label="Hora de fim"
                  value={value}
                  onChangeTime={onChange}
                  placeholder="00:00"
                />
              )}
            />
            {errors.endTime && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.endTime.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Motivo</Text>
            <Controller
              control={control}
              name="reason"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="Digite o motivo do bloqueio"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{ height: 100 }}
                />
              )}
            />
            {errors.reason && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.reason.message}
              </Text>
            )}
          </View>

          <AppButton
            title="Salvar Bloqueio Recorrente"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            loading={isPending}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
