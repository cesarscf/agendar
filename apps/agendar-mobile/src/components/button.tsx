import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  Text,
} from "react-native"
import { cn } from "../utils/cn"

type AppButtonProps = {
  title: string
  onPress?: () => void
  theme?: "primary" | "secondary" | "tertiary" | "danger"
  disabled?: boolean
  loading?: boolean
} & PressableProps

export function AppButton({
  title,
  onPress,
  theme = "primary",
  disabled,
  loading,
  className,
  ...rest
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-center rounded-md px-5 py-3 mb-4 border",
        theme === "primary" && "bg-[#fbdd65] border-[#f7d139]",
        theme === "secondary" && "bg-white border-gray-300",
        theme === "tertiary" && "bg-transparent border-transparent",
        theme === "danger" && "bg-red-500 border-red-600",
        disabled && "opacity-50",
        className
      )}
      disabled={disabled}
      {...rest}
    >
      <Text
        className={cn(
          "font-semibold text-lg tracking-wider",
          theme === "secondary" && "text-black",
          theme === "primary" && "text-black",
          theme === "tertiary" && "text-gray-800",
          theme === "danger" && "text-white"
        )}
      >
        {loading ? <ActivityIndicator className="size-6" /> : title}
      </Text>
    </Pressable>
  )
}
