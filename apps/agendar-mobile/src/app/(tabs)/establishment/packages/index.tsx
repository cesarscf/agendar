import { usePackages } from "@/hooks/data/packages/use-packages"
import { useRouter } from "expo-router"
import { ChevronRight, Package } from "lucide-react-native"
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

export default function Packages() {
  const { data: packages, isLoading } = usePackages()
  const router = useRouter()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    )
  }

  if (!packages || packages.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Empty
          message="Nenhum pacote cadastrado"
          icon={<Package size={48} color="#9CA3AF" />}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="mt-2 px-4">
          {packages?.map(pkg => {
            const isActive = pkg.active

            return (
              <Pressable
                key={pkg.id}
                onPress={() =>
                  router.push(`/(tabs)/establishment/packages/${pkg.id}`)
                }
                className="flex-row items-center justify-between p-2 py-5 border-b border-gray-100"
              >
                <View className="flex-row gap-4 flex-1 items-center">
                  {pkg.image ? (
                    <Image
                      source={{ uri: pkg.image }}
                      className="size-20 rounded-md"
                      resizeMode="cover"
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
                        {pkg.name}
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
                      Comissão: {pkg.commission}%
                    </Text>

                    <Text className="text-sm text-gray-500">
                      R$ {formatCentsToReal(Number(pkg.price))}
                    </Text>
                  </View>
                </View>

                <ChevronRight size={20} className="text-gray-400 ml-2" />
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
