import { createLoyaltyProgramSchema } from "@/lib/validations/loyalty-program"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import type { z } from "zod"
import { Input } from "@/components/input"
import { AppButton } from "@/components/button"
import { Select } from "@/components/select"
import { useCreateLoyaltyProgram } from "@/hooks/data/loyalty/use-create-loyalty-program"
import { useServices } from "@/hooks/data/services/use-services"
import { router } from "expo-router"
import React from "react"
import { Plus, Trash2 } from "lucide-react-native"

type Inputs = z.infer<typeof createLoyaltyProgramSchema>

export default function NewLoyaltyProgram() {
  const { mutateAsync, isPending } = useCreateLoyaltyProgram()
  const { data: services, isLoading: isLoadingServices } = useServices()
  const [loading, setLoading] = React.useState(false)

  const form = useForm<Inputs>({
    resolver: zodResolver(createLoyaltyProgramSchema),
    defaultValues: {
      serviceRewardId: "",
      name: "",
      requiredPoints: 0,
      rules: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  })

  async function onSubmit(inputs: Inputs) {
    setLoading(true)
    try {
      await mutateAsync(inputs)
      router.back()
    } catch {
      Alert.alert("Erro ao criar programa de fidelidade.")
    } finally {
      setLoading(false)
    }
  }

  const serviceOptions =
    services?.map(service => ({
      value: service.id,
      label: service.name,
    })) ?? []

  if (isLoadingServices) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Carregando serviços...</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 32,
            gap: 16,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Service Reward */}
          <View className="gap-1">
            <Text className="text-sm font-medium">Serviço de Recompensa</Text>
            <Controller
              control={form.control}
              name="serviceRewardId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={serviceOptions}
                  placeholder="Selecione um serviço de recompensa"
                />
              )}
            />
            {form.formState.errors.serviceRewardId && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.serviceRewardId.message}
              </Text>
            )}
          </View>

          {/* Name */}
          <View className="gap-1">
            <Text className="text-sm font-medium">Nome do Programa</Text>
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input
                  placeholder="Digite o nome do programa"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
            />
            {form.formState.errors.name && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.name.message}
              </Text>
            )}
          </View>

          {/* Required Points */}
          <View className="gap-1">
            <Text className="text-sm font-medium">Pontos Necessários</Text>
            <Controller
              control={form.control}
              name="requiredPoints"
              render={({ field }) => (
                <Input
                  placeholder="Ex: 100"
                  keyboardType="numeric"
                  {...field}
                  onBlur={field.onBlur}
                  value={field.value?.toString() || ""}
                  onChangeText={value => {
                    const numValue = Number.parseInt(value || "0", 10)
                    field.onChange(numValue)
                  }}
                />
              )}
            />
            {form.formState.errors.requiredPoints && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.requiredPoints.message}
              </Text>
            )}
          </View>

          {/* Rules Section */}
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium">Regras de Pontuação</Text>
              <TouchableOpacity
                onPress={() => append({ serviceId: "", points: 1 })}
                className="flex-row items-center gap-1 bg-blue-500 px-3 py-2 rounded-lg"
              >
                <Plus size={16} color="#fff" />
                <Text className="text-white text-sm font-medium">
                  Adicionar regra
                </Text>
              </TouchableOpacity>
            </View>

            {fields.length === 0 && (
              <View className="border border-dashed border-gray-300 rounded-lg p-4">
                <Text className="text-gray-500 text-center">
                  Nenhuma regra adicionada. Clique em "Adicionar regra" para
                  começar.
                </Text>
              </View>
            )}

            {fields.map((field, index) => (
              <View
                key={field.id}
                className="border border-gray-200 p-4 rounded-lg gap-3"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-medium text-gray-700">
                    Regra {index + 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => remove(index)}
                    className="p-2"
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View className="gap-1">
                  <Text className="text-sm font-medium">Serviço</Text>
                  <Controller
                    control={form.control}
                    name={`rules.${index}.serviceId`}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        options={serviceOptions}
                        placeholder="Selecione um serviço"
                      />
                    )}
                  />
                  {form.formState.errors.rules?.[index]?.serviceId && (
                    <Text className="text-red-500 text-xs">
                      {form.formState.errors.rules[index]?.serviceId?.message}
                    </Text>
                  )}
                </View>

                <View className="gap-1">
                  <Text className="text-sm font-medium">Pontos</Text>
                  <Controller
                    control={form.control}
                    name={`rules.${index}.points`}
                    render={({ field }) => (
                      <Input
                        placeholder="Ex: 50"
                        keyboardType="numeric"
                        {...field}
                        onBlur={field.onBlur}
                        value={field.value?.toString() || ""}
                        onChangeText={value => {
                          const numValue = Number.parseInt(value || "1", 10)
                          field.onChange(numValue)
                        }}
                        className="w-32"
                      />
                    )}
                  />
                  {form.formState.errors.rules?.[index]?.points && (
                    <Text className="text-red-500 text-xs">
                      {form.formState.errors.rules[index]?.points?.message}
                    </Text>
                  )}
                </View>
              </View>
            ))}

            {form.formState.errors.rules &&
              !Array.isArray(form.formState.errors.rules) && (
                <Text className="text-red-500 text-xs">
                  {form.formState.errors.rules.message}
                </Text>
              )}
          </View>
        </ScrollView>

        <View className="p-4 border-t border-gray-200 bg-white">
          <AppButton
            disabled={isPending || loading}
            loading={isPending || loading}
            title="Salvar Programa"
            theme="primary"
            onPress={form.handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
