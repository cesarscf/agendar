import { ListItem } from "@/components/list-item"
import { useSession } from "@/providers/auth-context"
import type { Href } from "expo-router"
import { ChevronRight, Headset, LogOut } from "lucide-react-native"
import { Pressable, Text, View } from "react-native"

export default function Settings() {
  const { signOut } = useSession()

  const items = [
    {
      label: "Suporte",
      description: "Fale com o suporte",
      route: "/(tabs)/settings/billing" as Href,
      icon: Headset,
    },
  ]

  return (
    <View className="flex-1 bg-white">
      <View className="mt-2 px-4">
        {items.map(item => (
          <ListItem
            key={item.label}
            Icon={item.icon}
            description={item.description}
            label={item.label}
            route={item.route}
          />
        ))}
        <Pressable
          onPress={() => {
            signOut()
          }}
          className="flex-row items-center justify-between p-2 py-6  border-gray-100 text-red-400"
        >
          <View className="flex-row gap-4 flex-1 items-center">
            <LogOut size={24} color={"#ff0000"} className=" mt-1" />
            <View className="flex-1">
              <Text className="text-base font-medium text-red-400">Sair</Text>
            </View>
          </View>
          <ChevronRight
            size={20}
            className="mt-1 text-red-400"
            color={"#ff0000"}
          />
        </Pressable>
      </View>
    </View>
  )
}
