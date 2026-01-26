import { categorySchema } from "@/lib/validations/category"
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
import { IconButton } from "../icon-button"
import { useRouter } from "expo-router"

import { useUpdateCategory } from "@/hooks/data/category/use-update-category"
import { useDeleteCategory } from "@/hooks/data/category/use-delete-category"
type Inputs = z.infer<typeof categorySchema>

type EditCategoryFormProps = {
  category: Inputs
}

export function EditCategoryForm({ category }: EditCategoryFormProps) {
  const { mutateAsync, isPending } = useUpdateCategory()
  const { mutateAsync: deleteAsync, isPending: isDeleting } =
    useDeleteCategory()
  const router = useRouter()

  const form = useForm<Inputs>({
    resolver: zodResolver(categorySchema),
    reValidateMode: "onBlur",
    defaultValues: {
      ...category,
    },
  })

  async function onSubmit(inputs: Inputs) {
    try {
      await mutateAsync(inputs)
      router.back()
    } catch {
      Alert.alert("Erro ao atualizar categoria.")
    }
  }

  async function handleDelete() {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta categoria?",
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
              await deleteAsync(category.id)
              router.back()
            } catch {
              Alert.alert("Erro ao excluir categoria.")
            }
          },
        },
      ]
    )
  }

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
          gap: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-1">
          <Text className="text-sm font-medium">Nome da Categoria</Text>
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <Input
                placeholder="Nome da categoria"
                {...field}
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

        <View className="mt-4 flex-row gap-2">
          <View className="flex-1">
            <AppButton
              disabled={isPending || isDeleting}
              loading={isPending}
              title="Salvar"
              theme="primary"
              onPress={form.handleSubmit(onSubmit)}
              className="py-2"
            />
          </View>
          <IconButton
            disabled={isPending || isDeleting}
            loading={isDeleting}
            onPress={handleDelete}
            variant="danger"
            className="self-start"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
