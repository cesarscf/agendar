import { router, Stack } from "expo-router"
import { ChevronLeft } from "lucide-react-native"
import { Pressable, View, Image } from "react-native"

function HeaderLeft() {
  return (
    <Pressable
      onPress={() => {
        router.back()
      }}
    >
      <ChevronLeft />
    </Pressable>
  )
}

function HeaderRight() {
  return (
    <View className="mr-4">
      <Image
        source={require("../../../../../assets/agendar-logo.png")}
        className="w-8 h-8"
        resizeMode="contain"
      />
    </View>
  )
}

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "FUNCIONAMENTO",
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight />,
        }}
      />
    </Stack>
  )
}
