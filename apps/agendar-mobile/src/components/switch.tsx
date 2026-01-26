import { Switch as RNSwitch, type SwitchProps, View, Text } from "react-native"
import { cn } from "@/utils/cn"

type CustomSwitchProps = {
  label?: string
  labelClassName?: string
} & SwitchProps

export function Switch({ label, labelClassName, ...props }: CustomSwitchProps) {
  if (label) {
    return (
      <View className="flex-row items-center justify-between">
        <Text className={cn("text-base text-black", labelClassName)}>
          {label}
        </Text>
        <RNSwitch
          trackColor={{ false: "#d1d5db", true: "#fbdd65" }}
          thumbColor={props.value ? "#f7d139" : "#f4f3f4"}
          ios_backgroundColor="#d1d5db"
          {...props}
        />
      </View>
    )
  }

  return (
    <RNSwitch
      trackColor={{ false: "#d1d5db", true: "#fbdd65" }}
      thumbColor={props.value ? "#f7d139" : "#f4f3f4"}
      ios_backgroundColor="#d1d5db"
      {...props}
    />
  )
}
