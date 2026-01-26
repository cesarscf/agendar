import { View } from "react-native"
import { CreateCategoryForm } from "@/components/forms/create-category-form"

export default function NewCategory() {
  return (
    <View className="flex-1 bg-white">
      <CreateCategoryForm />
    </View>
  )
}
