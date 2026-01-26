import { CalendarDays, Activity, Settings, ShoppingBag } from "lucide-react-native"
import { Tabs } from "expo-router"
import { Image, View } from "react-native"

function HeaderRight() {
  return (
    <View className="mr-4">
      <Image
        source={require("../../../assets/agendar-logo.png")}
        className="w-8 h-8"
        resizeMode="contain"
      />
    </View>
  )
}

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Agenda",
          headerShown: false,
          tabBarIcon: ({ color }) => <CalendarDays color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Relatórios",
          headerShown: true,
          headerRight: () => <HeaderRight />,
          tabBarIcon: ({ color }) => <Activity color={color} />,
        }}
      />
      <Tabs.Screen
        name="establishment"
        options={{
          title: "Loja",
          headerShown: false,
          tabBarIcon: ({ color }) => <ShoppingBag color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          headerShown: false,
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
    </Tabs>
  )
}
