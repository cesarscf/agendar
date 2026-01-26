import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native"

import { StorageEntity, uploadImageToFirebase } from "@/lib/upload-image"
import { useRouter } from "expo-router"
import React from "react"
import { useUpdateEstablishment } from "@/hooks/data/establishment/use-update-establishment"
import {
  updateEstablishmentSchema,
  type UpdateEstablishmentRequest,
} from "@/lib/validations/establishment"
import { Input } from "@/components/input"
import { ImagePickerControl } from "@/components/image-picker"
import { AppButton } from "@/components/button"
import { formatPhoneNumber } from "@/utils"
import * as Clipboard from "expo-clipboard"
import { Copy } from "lucide-react-native"

type Inputs = UpdateEstablishmentRequest

type UpdateEstablishmentFormProps = {
  data: Inputs
}

export const themeOptions = [
  { label: "Vermelho", value: "red", color: "#ef4444" },
  { label: "Verde", value: "green", color: "#22c55e" },
  { label: "Azul", value: "blue", color: "#3b82f6" },
  { label: "Roxo", value: "purple", color: "#8b5cf6" },
  { label: "Amarelo", value: "yellow", color: "#eab308" },
  { label: "Laranja", value: "orange", color: "#ff6900" },
]

export function UpdateEstablishmentForm({
  data,
}: UpdateEstablishmentFormProps) {
  const { mutateAsync, isPending } = useUpdateEstablishment()
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  async function copyStoreLink() {
    const slug = form.watch("slug")
    if (slug) {
      const link = `https://agendar-web-omega.vercel.app/${slug}`
      await Clipboard.setStringAsync(link)
      Alert.alert(
        "Link copiado!",
        "O link da loja foi copiado para a área de transferência."
      )
    }
  }

  const form = useForm<Inputs>({
    resolver: zodResolver(updateEstablishmentSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      id: data.id,
      name: data.name ?? "",
      slug: data.slug ?? "",
      theme: data.theme ?? "",
      about: data.about ?? "",
      bannerUrl: data.bannerUrl ?? "",
      logoUrl: data.logoUrl ?? "",
      phone: data.phone ?? "",
      servicesPerformed: data.servicesPerformed ?? "",
      activeCustomers: data.activeCustomers ?? "",
      experienceTime: data.experienceTime ?? "",
      googleMapsLink: data.googleMapsLink ?? "",
      address: data.address ?? "",
    },
  })

  async function onSubmit(inputs: Inputs) {
    setLoading(true)

    let logoUrl = inputs.logoUrl
    let bannerUrl = inputs.bannerUrl

    if (logoUrl && !logoUrl.startsWith("http")) {
      const uploaded = await uploadImageToFirebase(
        logoUrl,
        StorageEntity.Establishment
      )
      if (!uploaded) {
        Alert.alert("Erro ao salvar imagem.")
        setLoading(false)
        return
      }
      logoUrl = uploaded
    }

    if (bannerUrl && !bannerUrl.startsWith("http")) {
      const uploaded = await uploadImageToFirebase(
        bannerUrl,
        StorageEntity.Establishment
      )
      if (!uploaded) {
        Alert.alert("Erro ao salvar imagem.")
        setLoading(false)
        return
      }
      bannerUrl = uploaded
    }

    try {
      await mutateAsync({ ...inputs, logoUrl, bannerUrl })
      router.back()
    } catch (_) {
      Alert.alert("Erro ao atualizar estabelecimento.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-1">
            <Text className="text-sm font-medium">Nome da loja</Text>
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input
                  placeholder="Nome do estabelecimento"
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
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium">Link da loja</Text>
              <TouchableOpacity
                onPress={copyStoreLink}
                className="flex-row items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-md"
              >
                <Copy size={16} color="#374151" />
                <Text className="text-xs text-gray-700">Copiar link</Text>
              </TouchableOpacity>
            </View>
            <Controller
              control={form.control}
              name="slug"
              render={({ field }) => (
                <Input
                  placeholder="slug-do-estabelecimento"
                  {...field}
                  onChangeText={field.onChange}
                  autoCapitalize="none"
                />
              )}
            />
            {form.formState.errors.slug && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.slug.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium mb-1">Cor do Tema</Text>
            <Controller
              control={form.control}
              name="theme"
              render={({ field }) => (
                <View className="grid gri gap-4">
                  {themeOptions.map(option => (
                    <Pressable
                      key={option.value}
                      onPress={() => field.onChange(option.value)}
                      className="flex-row items-center gap-2"
                    >
                      <View
                        className={`w-4 h-4 rounded-full border border-gray-400 ${
                          field.value === option.value ? "bg-black" : "bg-white"
                        }`}
                      />
                      <Text className="text-sm">{option.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />
            {form.formState.errors.theme && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.theme.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Sobre Nós</Text>
            <Controller
              control={form.control}
              name="about"
              render={({ field }) => (
                <Input
                  placeholder="Descrição do estabelecimento"
                  multiline
                  numberOfLines={5}
                  className="h-40"
                  {...field}
                  onChangeText={field.onChange}
                />
              )}
            />
            {form.formState.errors.about && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.about.message}
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
                      placeholder="Telefone"
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
            <Text className="text-sm font-medium">Serviços Realizados</Text>
            <Controller
              control={form.control}
              name="servicesPerformed"
              render={({ field }) => (
                <Input
                  placeholder="Ex: +1000"
                  {...field}
                  onChangeText={field.onChange}
                />
              )}
            />
            {form.formState.errors.servicesPerformed && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.servicesPerformed.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Clientes Ativos</Text>
            <Controller
              control={form.control}
              name="activeCustomers"
              render={({ field }) => (
                <Input
                  placeholder="Número de clientes ativos"
                  {...field}
                  onChangeText={field.onChange}
                />
              )}
            />
            {form.formState.errors.activeCustomers && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.activeCustomers.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Tempo de Experiência</Text>
            <Controller
              control={form.control}
              name="experienceTime"
              render={({ field }) => (
                <Input
                  placeholder="Ex: 3 anos"
                  {...field}
                  onChangeText={field.onChange}
                />
              )}
            />
            {form.formState.errors.experienceTime && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.experienceTime.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium">Link do Google Maps</Text>
            <Controller
              control={form.control}
              name="googleMapsLink"
              render={({ field }) => (
                <Input
                  placeholder="https://maps.google.com/..."
                  {...field}
                  onChangeText={field.onChange}
                />
              )}
            />
            {form.formState.errors.googleMapsLink && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.googleMapsLink.message}
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
                  placeholder="Endereço completo"
                  multiline
                  numberOfLines={3}
                  className="h-32"
                  {...field}
                  onChangeText={field.onChange}
                />
              )}
            />
            {form.formState.errors.address && (
              <Text className="text-red-500 text-xs">
                {form.formState.errors.address.message}
              </Text>
            )}
          </View>

          <ImagePickerControl
            value={form.watch("bannerUrl")}
            onChange={uri =>
              form.setValue("bannerUrl", uri, { shouldValidate: true })
            }
            label="Banner da loja"
          />

          <ImagePickerControl
            value={form.watch("logoUrl")}
            onChange={uri =>
              form.setValue("logoUrl", uri, { shouldValidate: true })
            }
            label="Logo da loja"
          />
        </ScrollView>

        <View className="p-4 border-t border-gray-200 bg-white">
          <AppButton
            disabled={isPending || loading}
            loading={isPending || loading}
            title="Salvar Alterações"
            theme="primary"
            onPress={form.handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
