import { View } from "react-native"
import { CreateCustomerForm } from "@/components/forms/create-customer-form"

export default function NewService() {
  return (
    <View className="flex-1 bg-white">
      <CreateCustomerForm />
    </View>
  )
}
