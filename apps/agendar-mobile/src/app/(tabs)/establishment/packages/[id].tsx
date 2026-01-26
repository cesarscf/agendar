// app/edit-package/[id].tsx
import { useLocalSearchParams } from "expo-router"
import { usePackage } from "@/hooks/data/packages/use-package"
import { useServices } from "@/hooks/data/services"
import { Text, View } from "react-native"
import { EditPackageForm } from "@/components/forms/update-package-form"

export default function EditPackageScreen() {
  const { id } = useLocalSearchParams()
  const { data } = usePackage(id as string)
  const { data: services } = useServices()

  if (!data || !services) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Carregando...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      <EditPackageForm data={data} services={services} />
    </View>
  )
}
