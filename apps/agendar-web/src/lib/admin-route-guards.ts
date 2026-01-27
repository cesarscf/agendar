import { redirect } from "@tanstack/react-router"
import type { RouterContext } from "./router-context"

interface BeforeLoadContext {
  context: RouterContext
}

export async function requireAdminAuth({ context }: BeforeLoadContext) {
  if (context.adminAuth.isLoading) {
    return
  }

  if (!context.adminAuth.isAuthenticated) {
    throw redirect({
      to: "/admin/login",
    })
  }
}
