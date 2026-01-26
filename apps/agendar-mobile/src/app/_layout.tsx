import { SplashScreenController } from "@/components/splash"
import { SessionProvider, useSession } from "@/providers/auth-context"
import { Stack } from "expo-router"
import "../../global.css"
import { StatusBar } from "expo-status-bar"
import messaging from "@react-native-firebase/messaging"

import { queryClient } from "@/lib/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import { PermissionsAndroid } from "react-native"

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("Message handled in the background!", remoteMessage)
})

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <StatusBar style="dark" />
        <SplashScreenController />
        <RootNavigator />
      </SessionProvider>
    </QueryClientProvider>
  )
}

function RootNavigator() {
  const { session } = useSession()

  const isLoggedIn = !!session

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="not_subscription"
          options={{ headerShown: false }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  )
}
