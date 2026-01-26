import { View } from "react-native"
import { CreateServiceForm } from "@/components/forms/create-service-form"

export default function NewService() {
  return (
    <View className="flex-1 bg-white">
      <CreateServiceForm />
    </View>
  )
}
