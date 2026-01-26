import { createCategorySchema } from "@/lib/validations/category" // crie esse schema simples: { name: string.min(1) }
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
import { useCreateCategory } from "@/hooks/data/category/use-create-category"
import { router } from "expo-router"

type Inputs = z.infer<typeof createCategorySchema>

export function CreateCategoryForm() {
  const { mutateAsync, isPending } = useCreateCategory()
  const form = useForm<Inputs>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(inputs: Inputs) {
    try {
      await mutateAsync(inputs)
      router.back()
    } catch {
      Alert.alert("Erro ao criar categoria.")
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}
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

        <View className="mt-4">
          <AppButton
            disabled={isPending}
            loading={isPending}
            title="Criar Categoria"
            theme="primary"
            onPress={form.handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
