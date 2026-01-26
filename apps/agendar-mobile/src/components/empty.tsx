import { View, Text } from "react-native"
import { cn } from "@/utils/cn"

interface EmptyProps {
  message?: string
  icon?: React.ReactNode
  className?: string
}

export function Empty({
  message = "Nenhum item encontrado",
  icon,
  className,
}: EmptyProps) {
  return (
    <View
      className={cn("flex-1 items-center justify-center px-6 py-12", className)}
    >
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-center text-base text-gray-500">{message}</Text>
    </View>
  )
}
