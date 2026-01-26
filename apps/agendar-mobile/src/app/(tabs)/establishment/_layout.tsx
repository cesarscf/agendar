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
          title: "LOJA",
          headerRight: () => <HeaderRight />,
        }}
      />

      <Stack.Screen
        name="services"
        options={{
          title: "SERVIÇOS",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="categories"
        options={{
          title: "CATEGORIAS",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="employees"
        options={{
          title: "PROFISSIONAIS",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="general"
        options={{
          title: "GERAL",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="packages"
        options={{
          title: "PACOTES",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="loyalties"
        options={{
          title: "PROGRAMAS DE FIDELIDADE",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="customers"
        options={{
          title: "CLIENTES",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="availabilities"
        options={{
          title: "Funcionamento",
          headerShown: false,
        }}
      />
    </Stack>
  )
}
