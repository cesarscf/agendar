import { Stack } from "expo-router"
import { Image, View } from "react-native"

function HeaderRight() {
  return (
    <View className="mr-4">
      <Image
        source={require("../../../../assets/agendar-logo.png")}
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
          title: "CONFIGURAÇÕES",
          headerRight: () => <HeaderRight />,
        }}
      />
    </Stack>
  )
}
