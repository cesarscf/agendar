import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { AxiosError } from "axios"
import React from "react"

import { useAdminAuth } from "@/hooks/use-admin-auth"
import { adminApi } from "@/lib/admin-api-client"
import { clearAdminToken } from "@/lib/admin-auth"
import { requireAdminAuth } from "@/lib/admin-route-guards"

export const Route = createFileRoute("/admin")({
  beforeLoad: requireAdminAuth,
  component: AdminLayout,
})

function AdminLayout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { admin, isLoading } = useAdminAuth()

  React.useLayoutEffect(() => {
    const interceptorId = adminApi.interceptors.response.use(
      response => response,
      async error => {
        if (error instanceof AxiosError) {
          const status = error.response?.status

          if (status === 401) {
            queryClient.clear()
            clearAdminToken()
            navigate({
              to: "/admin/login",
              replace: true,
              search: { redirect: undefined },
            })
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      adminApi.interceptors.response.eject(interceptorId)
    }
  }, [navigate, queryClient])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <h1 className="font-semibold">Admin - Agendar</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">
              {admin?.role}
            </span>
            <button
              type="button"
              onClick={() => {
                clearAdminToken()
                navigate({ to: "/admin/login", search: { redirect: undefined } })
              }}
              className="text-sm text-red-500 hover:underline"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
