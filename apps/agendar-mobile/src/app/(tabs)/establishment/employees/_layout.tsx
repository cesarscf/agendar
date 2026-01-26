import { Link, router, Stack } from "expo-router"
import { ChevronLeft, Plus } from "lucide-react-native"
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

function HeaderRight({ showPlus = false }: { showPlus?: boolean }) {
  return (
    <View className="flex-row items-center gap-3 mr-2">
      {showPlus && (
        <Link href="/(tabs)/establishment/employees/new" asChild>
          <Pressable>
            <Plus />
          </Pressable>
        </Link>
      )}
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
          title: "PROFISSIONAIS",
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight showPlus={true} />,
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: "ADICIONAR PROFISSIONAL",
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight />,
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: "PROFISSIONAL",
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight />,
        }}
      />
    </Stack>
  )
}
