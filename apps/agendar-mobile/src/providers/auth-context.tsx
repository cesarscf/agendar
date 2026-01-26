import { useStorageState } from "@/hooks/use-storage-state"
import { getPartner, type Partner } from "@/http/auth/get-partner"

import messaging from "@react-native-firebase/messaging"
import { saveToken } from "@/http/push/save-token"
import React from "react"
import { router } from "expo-router"
import { useQueryClient } from "@tanstack/react-query"

const AuthContext = React.createContext<{
  signIn: (token: string) => void
  signOut: () => void
  session: string | null
  isLoading: boolean
  partner: Partner | null
}>({
  signIn: async () => ({ data: null, error: "Context not ready" }),
  signOut: () => null,
  session: null,
  isLoading: false,
  partner: null,
})

export function useSession() {
  const value = React.useContext(AuthContext)
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />")
  }

  return value
}

export function SessionProvider({ children }: React.PropsWithChildren) {
  const queryClient = useQueryClient()
  const [[isLoading, session], setSession] = useStorageState("token")
  const [[_, _establishmentId], setEstablishmentId] =
    useStorageState("establishment-id")
  const [partner, setPartner] = React.useState<Partner | null>(null)

  function signOut() {
    setSession(null)
    setPartner(null)
    queryClient.invalidateQueries()
  }

  function signIn(token: string) {
    setSession(token)
  }

  async function loadPartner() {
    const { data, error } = await getPartner()

    if (data) {
      setPartner(data.partner)
      setEstablishmentId(data.partner.establishments[0].id)
      savePartnerFcmToken(data.partner.id)

      const subscriptionStatus = data.partner?.subscriptions[0].status

      if (
        subscriptionStatus !== "active" &&
        subscriptionStatus !== "trialing"
      ) {
        router.replace("/not_subscription")
      } else {
        router.replace("/")
      }
    }

    if (error) {
      signOut()
    }
  }

  async function savePartnerFcmToken(id: string) {
    const token = await messaging().getToken()

    if (token) {
      await saveToken({
        token,
        userId: id,
      })
    }
  }

  React.useEffect(() => {
    if (session && !partner) loadPartner()
  }, [session, partner])

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
        partner,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
