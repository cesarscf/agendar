import { updateLoyaltyProgramSchema } from "@/lib/validations/loyalty-program"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import type { z } from "zod"
import { Input } from "@/components/input"
import { AppButton } from "@/components/button"
import { Select } from "@/components/select"
import { useUpdateLoyaltyProgram } from "@/hooks/data/loyalty/use-update-loyalty-program"
import { useDeleteLoyaltyProgram } from "@/hooks/data/loyalty/use-delete-loyalty-program"
import { useServices } from "@/hooks/data/services/use-services"
import { useLoyaltyProgram } from "@/hooks/data/loyalty/use-loyalty-program"
import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import { Plus, Trash2 } from "lucide-react-native"
import { useMutation } from "@tanstack/react-query"
import { activateLoyaltyProgram } from "@/http/loyalty/activate-loyalty-program"
import { desactiveLoyaltyProgram } from "@/http/loyalty/desactivate-loyalty-program"
import { queryClient } from "@/lib/react-query"

type Inputs = z.infer<typeof updateLoyaltyProgramSchema>

export default function EditLoyaltyProgram() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: program, isLoading: isLoadingProgram } = useLoyaltyProgram(id!)
  const { data: services, isLoading: isLoadingServices } = useServices()

  if (isLoadingProgram || isLoadingServices) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Carregando...</Text>
      </View>
    )
  }

  if (!program) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-lg text-gray-600 text-center">
          Programa não encontrado.
        </Text>
      </View>
    )
  }

  return (
    <UpdateLoyaltyProgramForm program={program} services={services ?? []} />
  )
}

interface UpdateLoyaltyProgramFormProps {
  program: NonNullable<ReturnType<typeof useLoyaltyProgram>["data"]>
  services: NonNullable<ReturnType<typeof useServices>["data"]>
}

function UpdateLoyaltyProgramForm({
  program,
  services,
}: UpdateLoyaltyProgramFormProps) {
  const { mutateAsync, isPending } = useUpdateLoyaltyProgram()
  const { mutateAsync: deleteMutate, isPending: deleteIsPending } =
    useDeleteLoyaltyProgram()
  const [loading, setLoading] = React.useState(false)
  const [isActive, setIsActive] = React.useState(program.active)

  const form = useForm<Inputs>({
    resolver: zodResolver(updateLoyaltyProgramSchema),
    defaultValues: {
      id: program.id,
      name: program.name,
      requiredPoints: program.requiredPoints,
      serviceRewardId: program.serviceRewardId,
      rules: program.rules.map(it => ({
        points: it.points,
        serviceId: it.serviceId,
        serviceName: it.serviceName,
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  })

  const toggleActivationMutation = useMutation({
    mutationFn: async (active: boolean) => {
      if (active) {
        await activateLoyaltyProgram(program.id)
      } else {
        await desactiveLoyaltyProgram(program.id)
      }
    },
    onSuccess: (_, active) => {
      setIsActive(active)
      queryClient.invalidateQueries({
        queryKey: ["loyalty-program", program.id],
      })
      queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] })
      Alert.alert(
        "Sucesso",
        active
          ? "Programa de fidelidade ativado com sucesso!"
          : "Programa de fidelidade desativado com sucesso!"
      )
    },
    onError: () => {
      Alert.alert("Erro", "Erro ao alterar status do programa")
    },
  })

  async function onSubmit(inputs: Inputs) {
    setLoading(true)
    try {
      await mutateAsync(inputs)
      Alert.alert("Sucesso", "Programa de fidelidade atualizado com sucesso!")
    } catch {
      Alert.alert("Erro", "Erro ao atualizar programa de fidelidade")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este programa de fidelidade? Todos os dados relacionados serão excluídos.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMutate(program.id)
              router.back()
            } catch {
              Alert.alert("Erro", "Erro ao excluir programa de fidelidade")
            }
          },
        },
      ]
    )
  }

  const serviceOptions =
    services?.map(service => ({
      value: service.id,
      label: service.name,
    })) ?? []

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

          {/* Status Toggle */}
          <View className="border border-gray-200 rounded-lg p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 gap-1">
                <Text className="text-sm font-medium">Status do Programa</Text>
                <Text className="text-sm text-gray-500">
                  {isActive
                    ? "Programa ativo e disponível para clientes"
                    : "Programa desativado"}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Text className="text-sm text-gray-500">
                  {isActive ? "Ativo" : "Inativo"}
                </Text>
                <Switch
                  value={isActive}
                  onValueChange={value =>
                    toggleActivationMutation.mutate(value)
                  }
                  disabled={toggleActivationMutation.isPending}
                  trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                  thumbColor={isActive ? "#ffffff" : "#f3f4f6"}
                />
              </View>
            </View>
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
                onPress={() =>
                  append({
                    serviceId: "",
                    points: 1,
                    serviceName: "Nome do serviço",
                  })
                }
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

        <View className="p-4 border-t border-gray-200 bg-white flex-row gap-3">
          <View className="flex-1">
            <AppButton
              disabled={deleteIsPending || loading}
              loading={deleteIsPending}
              title="Excluir"
              theme="danger"
              onPress={handleDelete}
            />
          </View>
          <View className="flex-1">
            <AppButton
              disabled={isPending || loading}
              loading={isPending || loading}
              title="Salvar"
              theme="primary"
              onPress={form.handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
