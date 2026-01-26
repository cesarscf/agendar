import { CreateServiceForm } from "@/components/forms/create-service-form"
import { View } from "react-native"

export default function NewService() {
  return (
    <View className="flex-1 bg-white">
      <CreateServiceForm />
    </View>
  )
}
