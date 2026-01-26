import { UpdateEstablishmentForm } from "@/components/forms/update-establishment-form"
import { useEstablishment } from "@/hooks/data/establishment/use-establishment"

import { ActivityIndicator, SafeAreaView, View } from "react-native"

export default function General() {
  const { data: establishment, isLoading } = useEstablishment()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    )
  }

  if (!establishment) return

  return (
    <SafeAreaView className="flex-1 bg-white">
      <UpdateEstablishmentForm data={establishment} />
    </SafeAreaView>
  )
}
