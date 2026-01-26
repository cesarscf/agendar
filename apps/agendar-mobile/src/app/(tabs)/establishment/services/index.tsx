import { useServices } from "@/hooks/data/services"
import { Link } from "expo-router"
import { ChevronRight, Scissors } from "lucide-react-native"
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native"
import { Empty } from "@/components/empty"
import { formatCentsToReal } from "@/utils/currency"

export default function Services() {
  const { data: services, isLoading } = useServices()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    )
  }

  if (!services || services.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Empty
          message="Nenhum serviço cadastrado"
          icon={<Scissors size={48} color="#9CA3AF" />}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="mt-2 px-4">
          {services?.map(service => {
            const isActive = service.active

            return (
              <Link
                href={`/(tabs)/establishment/services/${service.id}`}
                key={service.id}
                asChild
              >
                <Pressable className="flex-row items-center justify-between p-2 py-5 border-b border-gray-100">
                  <View className="flex-row gap-4 flex-1 items-center">
                    {service.image ? (
                      <Image
                        source={{ uri: service.image }}
                        className="size-20 rounded-md"
                      />
                    ) : (
                      <View className="size-20 bg-gray-200 rounded-md items-center justify-center">
                        <Text className="text-[10px] text-gray-500 text-center">
                          Sem imagem
                        </Text>
                      </View>
                    )}

                    <View className="flex-1 gap-1">
                      <View className="flex-row items-center gap-2 flex-wrap">
                        <Text className="text-base font-medium text-gray-900">
                          {service.name}
                        </Text>

                        <View
                          className={`px-2.5 py-0.5 rounded-full ${
                            isActive ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <Text
                            className={`text-sm font-semibold ${
                              isActive ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {isActive ? "Ativo" : "Inativo"}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-sm text-gray-500">
                        {service.durationInMinutes} min • R${" "}
                        {formatCentsToReal(Number(service.price))}
                      </Text>

                      {service.categories && service.categories.length > 0 && (
                        <View className="flex-row flex-wrap gap-1 mt-1">
                          {service.categories.map(category => (
                            <View
                              key={category.id}
                              className="bg-gray-200 px-2 py-0.5 rounded-full"
                            >
                              <Text className="text-xs text-gray-700">
                                {category.name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>

                  <ChevronRight size={20} className="text-gray-400 ml-2" />
                </Pressable>
              </Link>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
