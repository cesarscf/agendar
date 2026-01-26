import { type Href, Link } from "expo-router"
import { ChevronRight, type LucideIcon } from "lucide-react-native"
import { Pressable, Text, View } from "react-native"

interface ListItemProps {
  label: string
  description: string
  route: Href
  Icon: LucideIcon
}

export function ListItem({ description, Icon, label, route }: ListItemProps) {
  return (
    <Link href={route} asChild>
      <Pressable className="flex-row items-center justify-between p-2 py-6 border-b border-gray-100">
        <View className="flex-row gap-4 flex-1 items-center">
          <Icon size={24} className="text-gray-700 mt-1" />
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900">{label}</Text>
            <Text className="text-sm text-gray-500">{description}</Text>
          </View>
        </View>
        <ChevronRight size={20} className="text-gray-400 mt-1" />
      </Pressable>
    </Link>
  )
}
