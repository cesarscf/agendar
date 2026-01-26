import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { AxiosError } from "axios"
import React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { useAuth } from "@/hooks/use-auth"
import { useSubscription } from "@/hooks/use-subscription"
import { api } from "@/lib/api-client"
import { clearToken } from "@/lib/auth"
import { requireAuth } from "@/lib/route-guards"
import { AppSidebar } from "./-components/app-sidebar"
import { PlanExpiredWarning } from "./-components/plan-expired-warning"
import { SiteHeader } from "./-components/site-header"

export const Route = createFileRoute("/app")({
  beforeLoad: requireAuth,
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isLoading: authIsLoading } = useAuth()
  const { hasActiveSubscription, isLoading: subscriptionIsLoading } =
    useSubscription()

  React.useLayoutEffect(() => {
    const interceptorId = api.interceptors.response.use(
      response => response,
      async error => {
        if (error instanceof AxiosError) {
          const status = error.response?.status

          if (status === 401) {
            queryClient.clear()
            clearToken()
            navigate({
              to: "/login",
              replace: true,
              search: { redirect: undefined },
            })
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [navigate, queryClient])

  const isLoading = authIsLoading || subscriptionIsLoading

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!hasActiveSubscription) {
    return <PlanExpiredWarning />
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
