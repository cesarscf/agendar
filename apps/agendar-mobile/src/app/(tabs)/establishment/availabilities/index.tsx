import { getEstablishmentAvailability } from "@/http/establishment/get-establishment-availability"
import { useQuery } from "@tanstack/react-query"
import { ActivityIndicator, View } from "react-native"
import { UpdateAvailabilityForm } from "@/components/forms/update-availability-form"

export default function Availabilities() {
  const { data, isLoading } = useQuery({
    queryKey: ["availabilities"],
    queryFn: getEstablishmentAvailability,
  })

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return <UpdateAvailabilityForm availabilities={data ?? []} />
}
