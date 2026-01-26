import { useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"

import { EditServiceForm } from "@/components/forms/update-service-form"
import { useService } from "@/hooks/data/services/use-service"

export default function EditServiceScreen() {
  const { id } = useLocalSearchParams()

  if (!id) return null

  const { data: service } = useService(id as string)

  if (!service) return null

  if (!service) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Carregando...</Text>
      </View>
    )
  }

  return <EditServiceForm service={service} />
}
