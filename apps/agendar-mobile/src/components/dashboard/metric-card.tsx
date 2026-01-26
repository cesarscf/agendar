import { View, Text, ActivityIndicator, Pressable } from "react-native"
import type { LucideIcon } from "lucide-react-native"
import { cn } from "@/utils/cn"

type MetricCardProps = {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  className?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  isLoading,
  isError,
  onRetry,
  className,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <View
        className={cn(
          "bg-white rounded-xl p-4 border border-gray-200 min-h-[120px] justify-center items-center",
          className
        )}
      >
        <ActivityIndicator size="large" color="#000" />
        <Text className="text-sm text-gray-500 mt-2">Carregando...</Text>
      </View>
    )
  }

  if (isError) {
    return (
      <View
        className={cn(
          "bg-white rounded-xl p-4 border border-gray-200 min-h-[120px] justify-center items-center",
          className
        )}
      >
        <Text className="text-sm text-gray-700 mb-2 text-center">
          Erro ao carregar
        </Text>
        {onRetry && (
          <Pressable
            onPress={onRetry}
            className="bg-black rounded-lg px-4 py-2"
          >
            <Text className="text-white text-xs font-medium">
              Tentar Novamente
            </Text>
          </Pressable>
        )}
      </View>
    )
  }

  return (
    <View
      className={cn(
        "bg-white rounded-xl p-4 border border-gray-200",
        className
      )}
    >
      <View className="flex-row items-center gap-2 mb-2">
        <View className="bg-gray-100 rounded-lg p-2">
          <Icon size={20} color="#000" />
        </View>
        <Text className="text-sm font-medium text-gray-600 flex-1">
          {title}
        </Text>
      </View>
      <Text className="text-2xl font-bold text-black mb-1">{value}</Text>
      {subtitle && <Text className="text-xs text-gray-500">{subtitle}</Text>}
    </View>
  )
}
