import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updatePackageItemsSchema } from "@/lib/validations/packages"
import { Input } from "../input"
import { AppButton } from "../button"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useUpdatePackageItem } from "@/hooks/data/packages/use-update-package-item"
import type { Service } from "@/lib/validations/service"
import type { UpdatePackageItem } from "@/lib/validations/packages"
import { Plus, Trash2 } from "lucide-react-native"

type Inputs = {
  items: UpdatePackageItem[]
}

type Props = {
  packageId: string
  items: Inputs["items"]
  services: Service[]
}

export function EditPackageItemsForm({ packageId, items, services }: Props) {
  const form = useForm<Inputs>({
    resolver: zodResolver(updatePackageItemsSchema),
    defaultValues: {
      items: items.map(item => ({
        ...item,
        quantity: item.quantity ?? 1,
      })),
    },
  })

  const { control, handleSubmit } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const { mutateAsync, isPending } = useUpdatePackageItem()

  async function onSubmit(values: Inputs) {
    try {
      await mutateAsync({ items: values.items, packageId })
      alert("Itens atualizados com sucesso.")
    } catch (_) {
      alert("Erro ao atualizar os itens.")
    }
  }

  function handleAddItem() {
    append({ serviceId: "", quantity: 1 })
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        {fields.map((field, index) => (
          <View key={field.id} className="border rounded p-3 gap-3 bg-gray-50">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-semibold text-base">Item {index + 1}</Text>
              <TouchableOpacity onPress={() => remove(index)}>
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>

            <Controller
              control={control}
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
                control={control}
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
      </ScrollView>

      <View className="p-4 border-t border-gray-200">
        <AppButton
          title="Salvar Itens"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
        />
      </View>
    </View>
  )
}
