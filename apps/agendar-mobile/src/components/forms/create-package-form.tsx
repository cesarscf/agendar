import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native"
import type { z } from "zod"
import { Input } from "../input"
import { AppButton } from "../button"
import { ImagePickerControl } from "../image-picker"
import { router } from "expo-router"
import { StorageEntity, uploadImageToFirebase } from "@/lib/upload-image"
import { formatCurrencyInput, formatPercentageInput } from "@/utils/currency"
import React from "react"
import { useCreatePackage } from "@/hooks/data/packages/use-create-package"
import { createPackageSchema } from "@/lib/validations/packages"

type Inputs = z.infer<typeof createPackageSchema>

export function CreatePackageForm() {
  const { mutateAsync, isPending } = useCreatePackage()
  const [loading, setLoading] = React.useState(false)

  const form = useForm<Inputs>({
    resolver: zodResolver(createPackageSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      commission: "",
      image: "",
      price: "0,00",
      active: true,
      name: "",
      description: "",
    },
  })

  async function onSubmit(inputs: Inputs) {
    setLoading(true)
    let _imageUrl = inputs.image

    if (inputs.image && !inputs.image.startsWith("http")) {
      const uploaded = await uploadImageToFirebase(
        inputs.image,
        StorageEntity.Service
      )

      if (!uploaded) {
        Alert.alert("Erro ao salvar imagem.")
        return
      }

      _imageUrl = uploaded
    }
    try {
      const packageCreated = await mutateAsync({
        ...inputs,
      })

      router.push(`/(tabs)/establishment/packages/${packageCreated.id}`)
    } catch (_e) {
      Alert.alert("Erro ao cadastrar pacote.")
    } finally {
      setLoading(false)
    }
  }

  function onImageChange(uri: string) {
    form.setValue("image", uri, { shouldValidate: true })
  }

  const currentImage = form.watch("image")

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
                  placeholder="Nome do pacote"
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
            <Text className="text-sm font-medium">Valor do pacote</Text>
            <Controller
              control={form.control}
              name="price"
              render={({ field }) => (
                <Input
                  placeholder="Ex: 20,99 ou 1.000,00"
                  keyboardType="numeric"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={value => {
                    const formatted = formatCurrencyInput(value)
                    field.onChange(formatted)
                  }}
                  value={field.value}
                />
              )}
            />
            {form.formState.errors.price && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.price.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Comissão (%)</Text>
            <Controller
              control={form.control}
              name="commission"
              render={({ field }) => (
                <Input
                  placeholder="Ex: 50, 50.5 ou 50.55"
                  keyboardType="decimal-pad"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={value => {
                    const formatted = formatPercentageInput(value)
                    field.onChange(formatted)
                  }}
                  value={field.value}
                />
              )}
            />
            {form.formState.errors.commission && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.commission.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Descrição</Text>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Input
                  placeholder="Descrição do pacote (opcional)"
                  multiline
                  numberOfLines={4}
                  className="h-24"
                  {...field}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
            />
            {form.formState.errors.description && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.description.message}
              </Text>
            )}
          </View>

          <ImagePickerControl
            value={currentImage}
            onChange={onImageChange}
            label="Imagem do pacote"
          />
        </ScrollView>

        <View className="p-4 border-t border-gray-200 bg-white">
          <AppButton
            disabled={isPending || loading}
            loading={isPending || loading}
            title="Cadastrar Pacote"
            theme="primary"
            onPress={form.handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
