import { createServiceSchema } from "@/lib/validations/service"
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
import { CategorySelector } from "../category-selector"
import { useCreateService } from "@/hooks/data/services"
import { router } from "expo-router"
import { StorageEntity, uploadImageToFirebase } from "@/lib/upload-image"
import { formatCurrencyInput } from "@/utils/currency"
import React from "react"

type Inputs = z.infer<typeof createServiceSchema>

export function CreateServiceForm() {
  const { mutateAsync, isPending } = useCreateService()
  const [loading, setLoading] = React.useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<
    string[]
  >([])

  const form = useForm<Inputs>({
    resolver: zodResolver(createServiceSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      price: "0,00",
      active: true,
      durationInMinutes: "",
      description: "",
      image: "",
      categoryIds: [],
    },
  })

  async function onSubmit(inputs: Inputs) {
    setLoading(true)
    let imageUrl = inputs.image

    if (inputs.image && !inputs.image.startsWith("http")) {
      const uploaded = await uploadImageToFirebase(
        inputs.image,
        StorageEntity.Service
      )

      if (!uploaded) {
        Alert.alert("Erro ao salvar imagem.")
        return
      }

      imageUrl = uploaded
    }
    try {
      await mutateAsync({
        ...inputs,
        image: imageUrl,
        categoryIds:
          selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      })

      router.back()
    } catch {
      Alert.alert("Erro ao criar serviço.")
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
                  placeholder="Nome do serviço"
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
            <Text className="text-sm font-medium">Preço</Text>
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
            <Text className="text-sm font-medium">Duração (min)</Text>
            <Controller
              control={form.control}
              name="durationInMinutes"
              render={({ field }) => (
                <Input
                  placeholder="Duração em minutos"
                  keyboardType="numeric"
                  {...field}
                  onBlur={field.onBlur}
                  value={field.value}
                  onChangeText={value => field.onChange(value)}
                />
              )}
            />
            {form.formState.errors.durationInMinutes && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.durationInMinutes.message}
              </Text>
            )}
          </View>

          <CategorySelector
            selectedCategoryIds={selectedCategoryIds}
            onSelectionChange={setSelectedCategoryIds}
          />

          <View className="gap-1">
            <Text className="text-sm font-medium">Descrição</Text>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Input
                  placeholder="Descrição do serviço"
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
            {form.formState.errors.description && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.description.message}
              </Text>
            )}
          </View>

          <ImagePickerControl
            value={currentImage}
            onChange={onImageChange}
            label="Imagem do serviço"
          />
        </ScrollView>

        <View className="p-4 border-t border-gray-200 bg-white">
          <AppButton
            disabled={isPending || loading}
            loading={isPending || loading}
            title="Cadastrar Serviço"
            theme="primary"
            onPress={form.handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
