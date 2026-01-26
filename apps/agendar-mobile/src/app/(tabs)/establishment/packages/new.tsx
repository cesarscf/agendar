import { View } from "react-native"
import { CreatePackageForm } from "@/components/forms/create-package-form"

export default function NewPackage() {
  return (
    <View className="flex-1 bg-white">
      <CreatePackageForm />
    </View>
  )
}
