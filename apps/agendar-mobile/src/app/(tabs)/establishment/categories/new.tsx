import { CreateCategoryForm } from "@/components/forms/create-category-form"
import { View } from "react-native"

export default function NewCategory() {
  return (
    <View className="flex-1 bg-white">
      <CreateCategoryForm />
    </View>
  )
}
