import { CreatePackageForm } from "@/components/forms/create-package-form"
import { View } from "react-native"

export default function NewPackage() {
  return (
    <View className="flex-1 bg-white">
      <CreatePackageForm />
    </View>
  )
}
