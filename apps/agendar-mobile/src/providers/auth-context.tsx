import messaging from "@react-native-firebase/messaging"
import { useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import React from "react"
import { useStorageState } from "@/hooks/use-storage-state"
import {
  getEmployeeProfile,
  type EmployeeProfile,
} from "@/http/auth/get-employee-profile"
import {
  getPartner,
  type Partner,
} from "@/http/auth/get-partner"
import type { UserRole } from "@/http/auth/login"
import { saveToken } from "@/http/push/save-token"

const AuthContext = React.createContext<{
  signIn: (token: string, role: UserRole) => void
  signOut: () => void
  session: string | null
  isLoading: boolean
  partner: Partner | null
  employee: EmployeeProfile | null
  role: UserRole | null
}>({
  signIn: () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
  partner: null,
  employee: null,
  role: null,
})

export function useSession() {
  const value = React.useContext(AuthContext)
  if (!value) {
    throw new Error(
      "useSession must be wrapped in a <SessionProvider />"
    )
  }

  return value
}

export function SessionProvider({
  children,
}: React.PropsWithChildren) {
  const queryClient = useQueryClient()
  const [[isLoading, session], setSession] =
    useStorageState("token")
  const [[_, storedRole], setStoredRole] =
    useStorageState("role")
  const [
    [_estLoading, _establishmentId],
    setEstablishmentId,
  ] = useStorageState("establishment-id")
  const [partner, setPartner] =
    React.useState<Partner | null>(null)
  const [employee, setEmployee] =
    React.useState<EmployeeProfile | null>(null)

  const role = (storedRole as UserRole) ?? null

  function signOut() {
    setSession(null)
    setStoredRole(null)
    setPartner(null)
    setEmployee(null)
    queryClient.invalidateQueries()
  }

  function signIn(token: string, userRole: UserRole) {
    setSession(token)
    setStoredRole(userRole)
  }

  async function loadUser() {
    if (role === "employee") {
      await loadEmployee()
    } else {
      await loadPartner()
    }
  }

  async function loadPartner() {
    const { data, error } = await getPartner()

    if (data) {
      setPartner(data.partner)
      setEstablishmentId(
        data.partner.establishments[0].id
      )
      saveUserFcmToken(data.partner.id)

      const subscriptionStatus =
        data.partner?.subscriptions[0].status

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

  async function loadEmployee() {
    const { data, error } = await getEmployeeProfile()

    if (data) {
      setEmployee(data.employee)
      setEstablishmentId(data.establishment.id)
      saveUserFcmToken(data.employee.id)
      router.replace("/")
    }

    if (error) {
      signOut()
    }
  }

  async function saveUserFcmToken(id: string) {
    const token = await messaging().getToken()

    if (token) {
      await saveToken({
        token,
        userId: id,
      })
    }
  }

  React.useEffect(() => {
    if (session && !partner && !employee) loadUser()
  }, [session, partner, employee])

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
        partner,
        employee,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
