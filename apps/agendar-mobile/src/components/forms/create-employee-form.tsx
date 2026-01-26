import { createEmployeeSchema } from "@/lib/validations/employee"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
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
import { ImagePickerControl } from "../image-picker"
import { useCreateEmployee } from "@/hooks/data/employees"
import { router } from "expo-router"
import { StorageEntity, uploadImageToFirebase } from "@/lib/upload-image"
import { formatPhoneNumber } from "@/utils"
import React from "react"

type Inputs = z.infer<typeof createEmployeeSchema>

export function CreateEmployeeForm() {
  const { mutateAsync, isPending } = useCreateEmployee()
  const [loading, setLoading] = React.useState(false)

  const form = useForm<Inputs>({
    resolver: zodResolver(createEmployeeSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
      biography: "",
      active: true,
      avatarUrl: "",
    },
  })

  async function onSubmit(inputs: Inputs) {
    setLoading(true)
    let avatarUrl = inputs.avatarUrl

    if (inputs.avatarUrl && !inputs.avatarUrl.startsWith("http")) {
      const uploaded = await uploadImageToFirebase(
        inputs.avatarUrl,
        StorageEntity.Employee
      )

      if (!uploaded) {
        Alert.alert("Erro ao salvar imagem.")
        return
      }

      avatarUrl = uploaded
    }

    try {
      await mutateAsync({
        ...inputs,
        avatarUrl,
      })

      router.back()
    } catch (_e) {
      Alert.alert("Erro ao cadastrar profissional.")
    } finally {
      setLoading(false)
    }
  }

  function onImageChange(uri: string) {
    form.setValue("avatarUrl", uri, { shouldValidate: true })
  }

  const currentImage = form.watch("avatarUrl")

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
          <View className="gap-1">
            <Text className="text-sm font-medium">Nome</Text>
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input
                  placeholder="Nome do profissional"
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

          <View className="gap-1">
            <Text className="text-sm font-medium">E-mail</Text>
            <Controller
              control={form.control}
              name="email"
              render={({ field }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
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
            <Text className="text-sm font-medium">Telefone</Text>
            <Controller
              control={form.control}
              name="phone"
              render={({ field }) => {
                const formattedValue = formatPhoneNumber(field.value ?? "")
                return (
                  <>
                    <Input
                      placeholder="(11) 99999-9999"
                      keyboardType="phone-pad"
                      value={formattedValue}
                      onChangeText={text => {
                        const digitsOnly = text.replace(/\D/g, "")
                        field.onChange(digitsOnly)
                      }}
                      onBlur={field.onBlur}
                    />
                    {form.formState.errors.phone && (
                      <Text className="text-red-500 text-xs">
                        {form.formState.errors.phone.message}
                      </Text>
                    )}
                  </>
                )
              }}
            />
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Endereço</Text>
            <Controller
              control={form.control}
              name="address"
              render={({ field }) => (
                <Input
                  placeholder="Endereço completo"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
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
            <Text className="text-sm font-medium">Biografia</Text>
            <Controller
              control={form.control}
              name="biography"
              render={({ field }) => (
                <Input
                  placeholder="Sobre o profissional"
                  multiline
                  numberOfLines={5}
                  className="h-40"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
            />
            {form.formState.errors.biography && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.biography.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Controller
              control={form.control}
              name="active"
              render={({ field: { value, onChange } }) => (
                <View className="flex-row items-center justify-between p-3 rounded ">
                  <Text>{value ? "Ativo" : "Inativo"}</Text>
                  <Switch value={value} onValueChange={onChange} />
                </View>
              )}
            />
          </View>

          <ImagePickerControl
            value={currentImage}
            onChange={onImageChange}
            label="Foto do profissional"
          />
        </ScrollView>

        <View className="p-4 border-t border-gray-200 bg-white">
          <AppButton
            disabled={isPending || loading}
            loading={isPending || loading}
            title="Cadastrar Profissional"
            theme="primary"
            onPress={form.handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
