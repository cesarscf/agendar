import { updateServiceSchema } from "@/lib/validations/service"
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
import { IconButton } from "../icon-button"
import { ImagePickerControl } from "../image-picker"
import { CategorySelector } from "../category-selector"
import { StorageEntity, uploadImageToFirebase } from "@/lib/upload-image"
import { useRouter } from "expo-router"
import { formatCentsToReal, formatCurrencyInput } from "@/utils/currency"

import { useUpdateService } from "@/hooks/data/services"
import { useDeleteService } from "@/hooks/data/services/use-delete-service"
import React from "react"
import type { Service } from "@/lib/validations/service"

type Inputs = z.infer<typeof updateServiceSchema>

type EditServiceFormProps = {
  service: Service
}

export function EditServiceForm({ service }: EditServiceFormProps) {
  const { mutateAsync, isPending } = useUpdateService()
  const { mutateAsync: deleteAsync, isPending: isDeleting } = useDeleteService()
  const [loading, setLoading] = React.useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<
    string[]
  >(service.categories?.map(cat => cat.id) || [])

  const router = useRouter()

  const form = useForm<Inputs>({
    resolver: zodResolver(updateServiceSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      id: service.id,
      name: service.name,
      price: service.price
        ? formatCentsToReal(Number(service.price))
        : undefined,
      durationInMinutes: String(service.durationInMinutes),
      description: service.description,
      image: service.image ?? "",
      active: service.active,
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
        setLoading(false)
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
    } catch (_) {
      Alert.alert("Erro ao atualizar serviço.")
    } finally {
      setLoading(false)
    }
  }

  const currentImage = form.watch("image")

  function onImageChange(uri: string) {
    form.setValue("image", uri, { shouldValidate: true })
  }

  async function handleDelete() {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este serviço?",
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
              await deleteAsync(service.id)
              router.back()
            } catch {
              Alert.alert("Erro ao excluir serviço.")
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
                  onChangeText={field.onChange}
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
                  onChangeText={value => {
                    const formatted = formatCurrencyInput(value)
                    field.onChange(formatted)
                  }}
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
                  onChangeText={field.onChange}
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
                  onChangeText={field.onChange}
                />
              )}
            />
            {form.formState.errors.description && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.description.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Ativo</Text>
            <Controller
              control={form.control}
              name="active"
              render={({ field: { value, onChange } }) => (
                <View className="flex-row items-center justify-between p-3 rounded">
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    thumbColor={value ? "#10b981" : "#ccc"}
                    trackColor={{ false: "#e5e7eb", true: "#e5e7eb" }}
                  />
                </View>
              )}
            />
          </View>

          <ImagePickerControl
            value={currentImage}
            onChange={onImageChange}
            label="Imagem do serviço"
          />
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
