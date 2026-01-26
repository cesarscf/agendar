import {
  updatePackageSchema,
  updatePackageItemsSchema,
} from "@/lib/validations/packages"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Input } from "../input"
import { AppButton } from "../button"
import { IconButton } from "../icon-button"
import { ImagePickerControl } from "../image-picker"
import { Switch } from "../switch"
import { uploadImageToFirebase, StorageEntity } from "@/lib/upload-image"
import { useUpdatePackage } from "@/hooks/data/packages/use-update-package"
import { useDeletePackage } from "@/hooks/data/packages/use-delete-package"
import { useUpdatePackageItem } from "@/hooks/data/packages/use-update-package-item"
import { useRouter } from "expo-router"
import {
  formatCentsToReal,
  formatCurrencyInput,
  formatPercentageInput,
} from "@/utils/currency"
import type { z } from "zod"
import type { Service } from "@/lib/validations/service"
import type { UpdatePackageItem } from "@/lib/validations/packages"
import React from "react"
import { Picker } from "@react-native-picker/picker"
import { Plus, Trash2 } from "lucide-react-native"

type Inputs = z.infer<typeof updatePackageSchema>

type ItemsInputs = {
  items: UpdatePackageItem[]
}

type Props = {
  data: Inputs
  services: Service[]
}

export function EditPackageForm({ data, services }: Props) {
  const form = useForm<Inputs>({
    resolver: zodResolver(updatePackageSchema),
    defaultValues: {
      ...data,
      price: data.price ? formatCentsToReal(Number(data.price)) : undefined,
      commission: data.commission ? String(data.commission) : undefined,
    },
  })

  const itemsForm = useForm<ItemsInputs>({
    resolver: zodResolver(updatePackageItemsSchema),
    defaultValues: {
      items: (data.items ?? []).map(item => ({
        ...item,
        quantity: item.quantity ?? 1,
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: itemsForm.control,
    name: "items",
  })

  const { mutateAsync, isPending } = useUpdatePackage()
  const { mutateAsync: deleteAsync, isPending: isDeleting } = useDeletePackage()
  const { mutateAsync: updateItemsAsync, isPending: isUpdatingItems } =
    useUpdatePackageItem()
  const [loading, setLoading] = React.useState(false)
  const _router = useRouter()
  const currentImage = form.watch("image")

  function handleAddItem() {
    append({ serviceId: "", quantity: 1 })
  }

  async function onSubmit(values: Inputs) {
    setLoading(true)
    let imageUrl = values.image

    if (imageUrl && !imageUrl.startsWith("http")) {
      const uploaded = await uploadImageToFirebase(
        imageUrl,
        StorageEntity.Package
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
        ...values,
        image: imageUrl,
      })

      // Atualizar items também
      const itemsValues = itemsForm.getValues()
      await updateItemsAsync({ items: itemsValues.items, packageId: data.id })

      Alert.alert("Sucesso", "Pacote atualizado com sucesso!")
      _router.back()
    } catch (_error) {
      Alert.alert("Erro", "Não foi possível atualizar o pacote.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este pacote?",
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
              await deleteAsync(data.id)
              _router.back()
            } catch {
              Alert.alert("Erro ao excluir pacote.")
            }
          },
        },
      ]
    )
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View>
        <Text>Nome</Text>
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <Input
              placeholder="Nome do pacote"
              {...field}
              onChangeText={field.onChange}
            />
          )}
        />
      </View>

      <View>
        <Text>Comissão (%)</Text>
        <Controller
          control={form.control}
          name="commission"
          render={({ field }) => (
            <Input
              placeholder="Ex: 50, 50.5 ou 50.55"
              keyboardType="decimal-pad"
              {...field}
              onChangeText={value => {
                const formatted = formatPercentageInput(value)
                field.onChange(formatted)
              }}
            />
          )}
        />
      </View>

      <View>
        <Text>Preço</Text>
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
      </View>

      <View>
        <Text className="text-sm font-medium mb-2">Descrição</Text>
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
              onChangeText={field.onChange}
              value={field.value}
            />
          )}
        />
        {form.formState.errors.description && (
          <Text className="text-red-500 text-xs mt-1">
            {form.formState.errors.description.message}
          </Text>
        )}
      </View>

      <View>
        <Controller
          control={form.control}
          name="active"
          render={({ field }) => (
            <Switch
              label="Pacote Ativo"
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
      </View>

      <ImagePickerControl
        value={currentImage}
        onChange={uri => form.setValue("image", uri, { shouldValidate: true })}
        label="Imagem do pacote"
      />

      {/* Seção de Itens */}
      <View className="gap-4 mt-4">
        <Text className="text-lg font-semibold">Itens do Pacote</Text>

        {fields.map((field, index) => (
          <View key={field.id} className="border rounded p-3 gap-3 bg-gray-50">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-semibold text-base">Item {index + 1}</Text>
              <TouchableOpacity onPress={() => remove(index)}>
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>

            <Controller
              control={itemsForm.control}
              name={`items.${index}.serviceId`}
              render={({ field }) => (
                <Picker
                  selectedValue={field.value}
                  onValueChange={field.onChange}
                >
                  <Picker.Item label="Selecione um serviço" value="" />
                  {services.map(service => (
                    <Picker.Item
                      key={service.id}
                      label={service.name}
                      value={service.id}
                    />
                  ))}
                </Picker>
              )}
            />

            <View className="gap-1">
              <Text className="text-sm font-medium">Quantidade</Text>
              <Controller
                control={itemsForm.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <Input
                    placeholder="Quantidade"
                    keyboardType="numeric"
                    value={String(field.value)}
                    onChangeText={text => {
                      const parsed = parseInt(text, 10)
                      field.onChange(Number.isNaN(parsed) ? 0 : parsed)
                    }}
                  />
                )}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={handleAddItem}
        >
          <Plus size={18} color="#10b981" />
          <Text className="text-green-600 font-medium">Adicionar serviço</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-2 mt-4">
        <View className="flex-1">
          <AppButton
            title="Salvar"
            onPress={form.handleSubmit(onSubmit)}
            loading={loading || isPending || isUpdatingItems}
            disabled={loading || isPending || isDeleting || isUpdatingItems}
            className="py-2"
          />
        </View>
        <IconButton
          disabled={loading || isPending || isDeleting || isUpdatingItems}
          loading={isDeleting}
          onPress={handleDelete}
          variant="danger"
          className="self-start"
        />
      </View>
    </ScrollView>
  )
}
