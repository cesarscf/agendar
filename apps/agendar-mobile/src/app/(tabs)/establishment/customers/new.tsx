import { CreateCustomerForm } from "@/components/forms/create-customer-form"
import { View } from "react-native"

export default function NewService() {
  return (
    <View className="flex-1 bg-white">
      <CreateCustomerForm />
    </View>
  )
}
