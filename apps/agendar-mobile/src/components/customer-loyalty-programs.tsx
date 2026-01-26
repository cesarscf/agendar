import { View, Text, ScrollView, ActivityIndicator } from "react-native"
import { useCustomerLoyaltyPrograms } from "@/hooks/data/customers/use-customer-loyalty-programs"
import type { CustomerLoyaltyProgram } from "@/http/customers/get-customer-loyalty-programs"
import { Badge } from "./badge"
import { cn } from "@/utils/cn"

interface CustomerLoyaltyProgramsProps {
  customerPhone: string
}

export function CustomerLoyaltyPrograms({
  customerPhone,
}: CustomerLoyaltyProgramsProps) {
  const {
    data: programs,
    isLoading,
    error,
  } = useCustomerLoyaltyPrograms(customerPhone)

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <ActivityIndicator size="large" color="#fbdd65" />
        <Text className="mt-4 text-gray-600">
          Carregando programas de fidelidade...
        </Text>
      </View>
    )
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-red-600 text-center">
          Erro ao carregar programas de fidelidade
        </Text>
        <Text className="text-gray-500 text-center mt-2">{error}</Text>
      </View>
    )
  }

  // Empty state
  if (!programs || programs.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <View className="bg-gray-100 p-6 rounded-full mb-4">
          <Text className="text-4xl">🎁</Text>
        </View>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum programa de fidelidade
        </Text>
        <Text className="text-gray-600 text-center">
          Este cliente ainda não participa de nenhum programa de fidelidade.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <Text className="text-xl font-bold text-gray-900">
            ⭐ Programas de Fidelidade
          </Text>
        </View>

        <View className="gap-4">
          {programs.map(program => (
            <LoyaltyProgramCard key={program.id} program={program} />
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

interface LoyaltyProgramCardProps {
  program: CustomerLoyaltyProgram
}

function LoyaltyProgramCard({ program }: LoyaltyProgramCardProps) {
  const progressPercentage = Math.round(program.progress)

  return (
    <View className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Header */}
      <View className="mb-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-semibold text-gray-900 flex-1">
            {program.name}
          </Text>
          <Badge variant={program.active ? "default" : "canceled"}>
            {program.active ? "Ativo" : "Inativo"}
          </Badge>
        </View>
        <Text className="text-sm text-gray-600">
          {program.rewardService.name}
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-700">Progresso</Text>
          <Text className="text-sm font-semibold text-gray-900">
            {progressPercentage}%
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className={cn(
              "h-full rounded-full",
              program.canRedeem ? "bg-green-500" : "bg-[#fbdd65]"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
      </View>

      {/* Points Grid */}
      <View className="flex-row gap-3 mb-3">
        <View className="flex-1 bg-gray-50 p-3 rounded-lg">
          <Text className="text-xs text-gray-600 mb-1">Pontos atuais</Text>
          <Text className="text-xl font-bold text-gray-900">
            {program.points}
          </Text>
        </View>
        <View className="flex-1 bg-gray-50 p-3 rounded-lg">
          <Text className="text-xs text-gray-600 mb-1">Pontos necessários</Text>
          <Text className="text-xl font-bold text-gray-900">
            {program.requiredPoints}
          </Text>
        </View>
      </View>

      {/* Can Redeem Badge */}
      {program.canRedeem && (
        <View className="border-t border-gray-200 pt-3">
          <View className="bg-green-50 border border-green-500 rounded-lg p-3 flex-row items-center justify-center">
            <Text className="text-green-700 font-semibold text-center">
              🎁 Pode resgatar recompensa
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}
