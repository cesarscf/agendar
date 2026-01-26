import { View } from "react-native"
import { CreateEmployeeForm } from "@/components/forms/create-employee-form"

export default function NemEmployee() {
  return (
    <View className="flex-1 bg-white">
      <CreateEmployeeForm />
    </View>
  )
}
