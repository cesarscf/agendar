import { ActivityIndicator, Pressable, type PressableProps } from "react-native"
import { cn } from "../utils/cn"
import { Trash2 } from "lucide-react-native"

type IconButtonProps = {
  onPress?: () => void
  variant?: "danger" | "primary"
  disabled?: boolean
  loading?: boolean
  size?: number
} & PressableProps

export function IconButton({
  onPress,
  variant = "danger",
  disabled,
  loading,
  size = 20,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex items-center justify-center rounded-full p-2",
        variant === "danger" && "bg-red-500",
        variant === "primary" && "bg-[#fbdd65]",
        disabled && "opacity-50",
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Trash2
          size={size}
          color={variant === "danger" ? "white" : "black"}
          strokeWidth={2}
        />
      )}
    </Pressable>
  )
}
