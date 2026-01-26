import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native"
import type { z } from "zod"
import { Input } from "../input"
import { AppButton } from "../button"
import { IconButton } from "../icon-button"
import { Select } from "../select"
import type { SelectOption } from "../select"
import { updateEmployeeServicesSchema } from "@/lib/validations/employee"
import { useUpdateEmployeeServices } from "@/hooks/data/employees/use-update-employee-services"
import { useServices } from "@/hooks/data/services/use-services"
import type { Employee } from "@/lib/validations/employee"

type Inputs = z.infer<typeof updateEmployeeServicesSchema>

type UpdateEmployeeServiceFormProps = {
  employee: Employee
}

export function UpdateEmployeeServiceForm({
  employee,
}: UpdateEmployeeServiceFormProps) {
  const { mutateAsync, isPending } = useUpdateEmployeeServices()
  const { data: services = [], isLoading: isLoadingServices } = useServices()

  const [newServiceId, setNewServiceId] = useState("")
  const [newCommission, setNewCommission] = useState("")

  const form = useForm<Inputs>({
    resolver: zodResolver(updateEmployeeServicesSchema),
    defaultValues: {
      employeeId: employee.id,
      services: employee.services || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  })

  const serviceOptions: SelectOption[] = services.map(service => ({
    value: service.id,
    label: service.name,
  }))

  function handleAddService() {
    const selected = services.find(s => s.id === newServiceId)
    if (!selected) {
      Alert.alert("Erro", "Selecione um serviço válido para adicionar.")
      return
    }

    const isDuplicate = fields.some(field => field.serviceId === selected.id)
    if (isDuplicate) {
      Alert.alert("Atenção", "Este serviço já foi adicionado à lista.")
      return
    }

    append({
      serviceId: selected.id,
      serviceName: selected.name,
      commission: newCommission || "0",
      active: true,
    })

    setNewServiceId("")
    setNewCommission("")
  }

  async function onSubmit(inputs: Inputs) {
    if (inputs.services.length > 0) {
      const serviceIds = inputs.services.map(s => s.serviceId)
      const hasDuplicates = serviceIds.length !== new Set(serviceIds).size

      if (hasDuplicates) {
        Alert.alert(
          "Atenção",
          "Existem serviços duplicados na lista. Remova os duplicados antes de salvar."
        )
        return
      }
    }

    if (inputs.services.length === 0 && (employee.services?.length ?? 0) > 0) {
      Alert.alert(
        "Confirmar",
        "Você está prestes a remover todos os serviços deste profissional. Deseja continuar?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Confirmar",
            onPress: async () => {
              try {
                await mutateAsync(inputs)
                Alert.alert("Sucesso", "Serviços atualizados com sucesso!")
              } catch (e) {
                console.log(e)
                Alert.alert("Erro", "Erro ao atualizar serviços.")
              }
            },
          },
        ]
      )
      return
    }

    try {
      await mutateAsync(inputs)
      Alert.alert("Sucesso", "Serviços atualizados com sucesso!")
    } catch (e) {
      console.log(e)
      Alert.alert("Erro", "Erro ao atualizar serviços.")
    }
  }

  function formatPercentage(value: string) {
    // Remove tudo exceto dígitos e ponto
    let cleaned = value.replace(/[^\d.]/g, "")

    if (!cleaned) return ""

    // Garante apenas um ponto decimal
    const parts = cleaned.split(".")
    if (parts.length > 2) {
      cleaned = `${parts[0]}.${parts.slice(1).join("")}`
    }

    // Limita a 2 casas decimais
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = `${parts[0]}.${parts[1].slice(0, 2)}`
    }

    // Limita a 100
    const numValue = parseFloat(cleaned)
    if (!isNaN(numValue) && numValue > 100) {
      return "100"
    }

    return cleaned
  }

  function parsePercentage(formattedValue: string) {
    return formattedValue.replace(/[^\d.]/g, "")
  }

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 32,
            gap: 16,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-2 mb-4">
            <Text className="text-xl font-bold">
              Atualizar serviços do profissional
            </Text>
            <Text className="text-gray-600">
              Atualize os serviços que o profissional {employee.name} realiza
            </Text>
          </View>

          <View className="border border-gray-200 rounded-lg p-4 gap-4 bg-gray-50">
            <Text className="font-semibold text-base">
              ADICIONAR NOVO SERVIÇO
            </Text>

            <View className="gap-1">
              <Text className="text-sm font-medium">Novo Serviço</Text>
              <Select
                value={newServiceId}
                onValueChange={setNewServiceId}
                options={serviceOptions}
                placeholder="Selecione um serviço"
                disabled={isLoadingServices || serviceOptions.length === 0}
              />
            </View>

            <View className="gap-1">
              <Text className="text-sm font-medium">Comissão (%)</Text>
              <View className="flex-row items-center gap-2">
                <View className="flex-1">
                  <Input
                    placeholder="0"
                    keyboardType="numeric"
                    value={formatPercentage(newCommission)}
                    onChangeText={text => {
                      const unmasked = parsePercentage(text)
                      setNewCommission(unmasked)
                    }}
                  />
                </View>
                <Text className="text-lg font-medium text-gray-700">%</Text>
              </View>
            </View>

            <AppButton
              title="Adicionar"
              theme="secondary"
              onPress={handleAddService}
              disabled={!newServiceId}
            />
          </View>

          {fields.length > 0 && (
            <View className="gap-4">
              <Text className="font-semibold text-base">
                SERVIÇOS VINCULADOS
              </Text>
              {fields.map((field, index) => (
                <View
                  key={field.id}
                  className="border border-gray-200 rounded-lg p-4 gap-4"
                >
                  <View className="gap-1">
                    <Text className="text-sm font-medium">Serviço</Text>
                    <Input value={field.serviceName} editable={false} />
                  </View>

                  <View className="gap-1">
                    <Text className="text-sm font-medium">Comissão (%)</Text>
                    <Controller
                      control={form.control}
                      name={`services.${index}.commission`}
                      render={({ field: f }) => (
                        <>
                          <View className="flex-row items-center gap-2">
                            <View className="flex-1">
                              <Input
                                placeholder="0"
                                keyboardType="numeric"
                                value={formatPercentage(f.value)}
                                onChangeText={text => {
                                  const unmasked = parsePercentage(text)
                                  f.onChange(unmasked)
                                }}
                              />
                            </View>
                            <Text className="text-lg font-medium text-gray-700">%</Text>
                          </View>
                          {form.formState.errors.services?.[index]
                            ?.commission && (
                            <Text className="text-red-500 text-xs">
                              {
                                form.formState.errors.services[index]
                                  ?.commission?.message
                              }
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Controller
                        control={form.control}
                        name={`services.${index}.active`}
                        render={({ field: f }) => (
                          <>
                            <Switch
                              value={f.value}
                              onValueChange={f.onChange}
                              thumbColor={f.value ? "#10b981" : "#ccc"}
                              trackColor={{ false: "#e5e7eb", true: "#e5e7eb" }}
                            />
                            <Text className="text-sm font-medium">Ativo</Text>
                          </>
                        )}
                      />
                    </View>

                    <IconButton
                      onPress={() => remove(index)}
                      variant="danger"
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {fields.length === 0 && (
            <View className="py-8 items-center">
              <Text className="text-gray-400">
                Nenhum serviço vinculado ainda
              </Text>
            </View>
          )}
        </ScrollView>

        <View className="p-4 border-t border-gray-200 bg-white">
          <AppButton
            disabled={isPending}
            loading={isPending}
            title="Salvar Serviços"
            theme="primary"
            onPress={form.handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
