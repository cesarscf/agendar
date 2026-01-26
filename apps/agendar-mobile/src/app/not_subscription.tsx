import { AppButton } from "@/components/button"
import { StatusBar } from "expo-status-bar"
import { Linking, View, Text } from "react-native"

export default function NotSubscription() {
  const PLANS_URL = "https://test.com.br/plans"

  function openPlansPage() {
    Linking.openURL(PLANS_URL)
  }

  return (
    <View className="flex-1 bg-[#001240] justify-center items-center px-6">
      <StatusBar style="light" />

      <Text className="text-white text-3xl font-semibold text-center mb-6">
        Nenhum plano ativo
      </Text>

      <Text className="text-white text-base text-center mb-10">
        Você ainda não possui um plano ativo. Para continuar utilizando nossos
        serviços, escolha um dos planos disponíveis no site.
      </Text>

      <AppButton
        title="Ver planos"
        className="w-full"
        onPress={openPlansPage}
      />
    </View>
  )
}
