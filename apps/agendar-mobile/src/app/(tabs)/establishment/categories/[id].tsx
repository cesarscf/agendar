import { useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"

import { useCategory } from "@/hooks/data/category/use-category"
import { EditCategoryForm } from "@/components/forms/update-category-form"

export default function EditCategoryScreen() {
  const { id } = useLocalSearchParams()

  if (!id) return null

  const { data: category } = useCategory(id as string)

  if (!category) return null

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Carregando...</Text>
      </View>
    )
  }

  return <EditCategoryForm category={category} />
}
