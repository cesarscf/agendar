import { Text, View } from "react-native"
import { cn } from "@/utils/cn"

interface BadgeProps {
  variant?: "scheduled" | "completed" | "canceled" | "default"
  children: React.ReactNode
  className?: string
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  const variantStyles = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  }

  return (
    <View
      className={cn(
        "px-2 py-1 rounded-full self-start",
        variantStyles[variant],
        className
      )}
    >
      <Text className={cn("text-xs font-semibold", variantStyles[variant])}>
        {children}
      </Text>
    </View>
  )
}
