import { useLoyaltyPrograms } from "@/hooks/data/loyalty/use-loyalty-programs"
import { Link } from "expo-router"
import { Gift, FolderOpen } from "lucide-react-native"
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native"
import { Empty } from "@/components/empty"
import { Badge } from "@/components/badge"

const SKELETON_IDS = Array.from(
  { length: 6 },
  (_, i) => `skeleton-${Date.now()}-${i}`
)

export default function Loyalties() {
  const { data: loyaltyPrograms, isLoading } = useLoyaltyPrograms()

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1 p-4">
          <View className="gap-4">
            {SKELETON_IDS.map(id => (
              <View
                key={id}
                className="bg-gray-200 rounded-lg p-4 h-48 animate-pulse"
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  if (!loyaltyPrograms || loyaltyPrograms.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Empty
          message="Nenhum programa encontrado"
          icon={<FolderOpen size={48} color="#9CA3AF" />}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <View className="gap-4">
          {loyaltyPrograms.map(program => (
            <Link
              href={`/(tabs)/establishment/loyalties/${program.id}`}
              key={program.id}
              asChild
            >
              <Pressable
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm active:shadow-md active:scale-[0.99]"
                android_ripple={{ color: "#f3f4f6" }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-2">
                    <Gift size={20} color="#6366F1" />
                    <Text className="text-lg font-semibold text-gray-900">
                      {program.name}
                    </Text>
                  </View>
                  <Badge variant={program.active ? "completed" : "default"}>
                    {program.active ? "Ativo" : "Inativo"}
                  </Badge>
                </View>

                <Text className="text-sm text-gray-600 mb-3">
                  Recompensa: {program.serviceRewardName}
                </Text>

                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Pontos Necessários: {program.requiredPoints}
                  </Text>
                </View>

                <View className="border-t border-gray-200 pt-3">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Regras:
                  </Text>
                  {program.rules.map(rule => (
                    <View
                      key={rule.serviceId}
                      className="flex-row justify-between items-center mb-1"
                    >
                      <Text className="text-sm text-gray-600">
                        • {rule.serviceName}
                      </Text>
                      <Text className="text-sm font-medium text-green-600">
                        +{rule.points} pts
                      </Text>
                    </View>
                  ))}
                </View>

                <View className="border-t border-gray-200 pt-3 mt-3 flex-row justify-between items-center">
                  <Text className="text-sm text-gray-500">Ver detalhes</Text>
                  <Text className="text-gray-400">→</Text>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
