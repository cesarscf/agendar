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
  createBlockSchema,
  type CreateEmployeeBlockRequest,
} from "@/lib/validations/blocks"
import { useCreateEmployeeBlock } from "@/hooks/data/employees/use-create-employee-block"
import { AppButton } from "../button"
import { Input } from "../input"
import { DateTimePickerInput } from "../date-time-picker"

interface CreateEmployeeBlockFormProps {
  employeeId: string
  onSuccess?: () => void
}

export function CreateEmployeeBlockForm({
  employeeId,
  onSuccess,
}: CreateEmployeeBlockFormProps) {
  const { mutateAsync, isPending } = useCreateEmployeeBlock()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEmployeeBlockRequest>({
    resolver: zodResolver(createBlockSchema),
    defaultValues: {
      startsAt: undefined,
      endsAt: undefined,
      reason: "",
    },
  })

  const onSubmit = async (data: CreateEmployeeBlockRequest) => {
    try {
      await mutateAsync({
        employeeId,
        ...data,
      })

      Alert.alert("Sucesso", "Bloqueio criado com sucesso!")
      reset()
      onSuccess?.()
    } catch (error) {
      Alert.alert("Erro", error as string)
    }
  }

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
            <Controller
              control={control}
              name="startsAt"
              render={({ field: { onChange, value } }) => (
                <DateTimePickerInput
                  label="Data e hora de início"
                  value={value}
                  onChangeDateTime={onChange}
                  placeholder="Selecione a data e hora de início"
                />
              )}
            />
            {errors.startsAt && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.startsAt.message}
              </Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="endsAt"
              render={({ field: { onChange, value } }) => (
                <DateTimePickerInput
                  label="Data e hora de fim"
                  value={value}
                  onChangeDateTime={onChange}
                  placeholder="Selecione a data e hora de fim"
                />
              )}
            />
            {errors.endsAt && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.endsAt.message}
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
            title="Salvar Bloqueio"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            loading={isPending}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
