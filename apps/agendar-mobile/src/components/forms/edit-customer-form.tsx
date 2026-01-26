import { updateCustomerSchema } from "@/lib/validations/customer"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import React from "react"
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native"
import { Input } from "../input"
import { AppButton } from "../button"
import { IconButton } from "../icon-button"

import { router } from "expo-router"
import type { z } from "zod"
import { useUpdateCustomer } from "@/hooks/data/customers/use-update-customer"
import { useDeleteCustomer } from "@/hooks/data/customers/use-delete-customer"
import {
  formatDate,
  formatDateToString,
  formatPhoneNumber,
  parseDateFromString,
} from "@/utils"

type Inputs = z.infer<typeof updateCustomerSchema>

interface Props {
  customer: Inputs
}

export function EditCustomerForm({ customer }: Props) {
  const { mutateAsync, isPending } = useUpdateCustomer()
  const { mutateAsync: deleteAsync, isPending: isDeleting } =
    useDeleteCustomer()
  const [loading, setLoading] = React.useState(false)

  const form = useForm<Inputs>({
    resolver: zodResolver(updateCustomerSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      id: customer.id,
      name: customer.name ?? "",
      phoneNumber: customer.phoneNumber ?? "",
      birthDate:
        typeof customer.birthDate === "string" && customer.birthDate
          ? new Date(customer.birthDate)
          : customer.birthDate,
      email: customer.email ?? "",
      cpf: customer.cpf ?? "",
      address: customer.address ?? "",
      city: customer.city ?? "",
      state: customer.state ?? "",
      notes: customer.notes ?? "",
    },
  })

  const birthDateValue = form.watch("birthDate")
  const [dateText, setDateText] = React.useState(() =>
    formatDateToString(birthDateValue)
  )

  React.useEffect(() => {
    const formatted = formatDateToString(birthDateValue)
    if (formatted !== dateText) {
      setDateText(formatted)
    }
  }, [birthDateValue])

  async function onSubmit(inputs: Inputs) {
    setLoading(true)
    try {
      await mutateAsync(inputs)
      router.back()
    } catch {
      Alert.alert("Erro ao atualizar cliente.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este cliente?",
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
              await deleteAsync(customer.id)
              router.back()
            } catch {
              Alert.alert("Erro ao excluir cliente.")
            }
          },
        },
      ]
    )
  }

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-1">
            <Text className="text-sm font-medium">Nome *</Text>
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input
                  placeholder="Nome"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value ?? ""}
                />
              )}
            />
            {form.formState.errors.name && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.name.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Telefone *</Text>
            <Controller
              control={form.control}
              name="phoneNumber"
              render={({ field }) => {
                const formattedValue = formatPhoneNumber(field.value ?? "")
                return (
                  <>
                    <Input
                      placeholder="Telefone"
                      keyboardType="phone-pad"
                      value={formattedValue}
                      onChangeText={text => {
                        const digitsOnly = text.replace(/\D/g, "")
                        field.onChange(digitsOnly)
                      }}
                      onBlur={field.onBlur}
                    />
                    {form.formState.errors.phoneNumber && (
                      <Text className="text-red-500 text-xs">
                        {form.formState.errors.phoneNumber.message}
                      </Text>
                    )}
                  </>
                )
              }}
            />
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Data de Nascimento *</Text>
            <Controller
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <Input
                  placeholder="DD/MM/AAAA"
                  value={dateText}
                  keyboardType="numeric"
                  maxLength={10}
                  onChangeText={text => {
                    const masked = formatDate(text)
                    setDateText(masked)
                    const dateObj = parseDateFromString(masked)
                    field.onChange(dateObj)
                  }}
                  onBlur={() => {
                    const dateObj = parseDateFromString(dateText)
                    field.onChange(dateObj)
                    field.onBlur()
                  }}
                />
              )}
            />
            {form.formState.errors.birthDate && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.birthDate.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Email</Text>
            <Controller
              control={form.control}
              name="email"
              render={({ field }) => (
                <Input
                  placeholder="Email"
                  keyboardType="email-address"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value ?? ""}
                />
              )}
            />
            {form.formState.errors.email && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.email.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">CPF</Text>
            <Controller
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <Input
                  placeholder="CPF"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value ?? ""}
                />
              )}
            />
            {form.formState.errors.cpf && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.cpf.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Endereço</Text>
            <Controller
              control={form.control}
              name="address"
              render={({ field }) => (
                <Input
                  placeholder="Endereço"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value ?? ""}
                />
              )}
            />
            {form.formState.errors.address && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.address.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Cidade</Text>
            <Controller
              control={form.control}
              name="city"
              render={({ field }) => (
                <Input
                  placeholder="Cidade"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value ?? ""}
                />
              )}
            />
            {form.formState.errors.city && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.city.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Estado</Text>
            <Controller
              control={form.control}
              name="state"
              render={({ field }) => (
                <Input
                  placeholder="Estado"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value ?? ""}
                />
              )}
            />
            {form.formState.errors.state && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.state.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Observações</Text>
            <Controller
              control={form.control}
              name="notes"
              render={({ field }) => (
                <Input
                  placeholder="Observações"
                  multiline
                  className="h-32"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value ?? ""}
                />
              )}
            />
            {form.formState.errors.notes && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.notes.message}
              </Text>
            )}
          </View>
        </ScrollView>

        <View className="p-4 border-t border-gray-200 bg-white flex-row gap-2">
          <View className="flex-1">
            <AppButton
              disabled={isPending || loading || isDeleting}
              loading={isPending || loading}
              title="Salvar"
              theme="primary"
              onPress={form.handleSubmit(onSubmit)}
              className="py-2"
            />
          </View>
          <IconButton
            disabled={isPending || loading || isDeleting}
            loading={isDeleting}
            onPress={handleDelete}
            variant="danger"
            className="self-start"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
