import { redirect } from "@tanstack/react-router"
import type { RouterContext } from "./router-context"

interface BeforeLoadContext {
  context: RouterContext
  location: {
    href: string
  }
}

export async function requireAdminAuth({
  context,
  location,
}: BeforeLoadContext) {
  if (context.adminAuth.isLoading) {
    return
  }

  if (!context.adminAuth.isAuthenticated) {
    throw redirect({
      to: "/admin/login",
      search: {
        redirect: location.href,
      },
    })
  }
}
